import { TrackType, Discipline, L2LProvider, L2LTeam, L2LOffering } from '../types';

export const COMMERCE_TIERS = {
  TIER_1: { id: 'tier_1', maxWeeks: 6, requiredCompletions: 0 },
  TIER_2: { id: 'tier_2', maxWeeks: 12, requiredCompletions: 3 },
  TIER_3: { id: 'tier_3', maxWeeks: 26, requiredCompletions: 5 } // Corrected typo: Tier 3 requires 5 completions
};

export const LEARNING_TIERS = {
  TIER_1: { id: 'tier_1', maxDuration: '1 week', requiredCompletions: 0 },
  TIER_2: { id: 'tier_2', maxDuration: '10 days', requiredCompletions: 1 },
  TIER_3: { id: 'tier_3', maxDuration: '3 weeks', requiredCompletions: 1 },
  TIER_4: { id: 'tier_4', maxDuration: '1 month', requiredCompletions: 3 },
  TIER_5: { id: 'tier_5', maxDuration: '8 weeks', requiredCompletions: 8 }
};

export const validateProviderForLearning = (provider: L2LProvider): { valid: boolean; reason?: string } => {
  if (provider.phase < 4 && provider.age < 22) {
    return { valid: false, reason: 'Must be Juice Node Phase 4 or 22+ to lead knowledge nodes.' };
  }
  return { valid: true };
};

export const validateCommerceRequirements = (provider: L2LProvider): boolean => {
  const totalExp = provider.yearsInternship + provider.yearsNonInternship;
  return (
    provider.discipline === Discipline.Web3Dev &&
    provider.yearsInternship >= 2 &&
    provider.yearsNonInternship >= 3 &&
    totalExp >= 5
  );
};

/**
 * Enhanced Team Validation Protocol
 * Enforces institutional cluster composition rules including minimum size and specialization gating.
 */
export const validateTeam = (team: L2LTeam): { valid: boolean; reason?: string } => {
  // Rule: Platform enforcement
  if (!team.usesFullStack) {
    return { 
      valid: false, 
      reason: 'Infrastructure Violation: Clusters must utilize the Assurative / Juice Node Full-Stack Platform for deterministic orchestration.' 
    };
  }

  const developerCount = team.developers.length;
  const totalMembers = developerCount + 1; // Developers + 1 Project Manager

  // Rule: Minimum Team Size Matrix
  // 1. If PM is an Architect or Fullstack Lead, min cluster size is 3 (Efficiency Mode).
  // 2. Otherwise, min cluster size is 4 (Standard Velocity Mode).
  const isHighCapacityLead = team.projectManager.discipline === Discipline.FullstackDev || 
                             team.projectManager.discipline === Discipline.Architect;
  
  const minRequired = isHighCapacityLead ? 3 : 4;
  
  if (totalMembers < minRequired) {
    return { 
      valid: false, 
      reason: `Composition Error: Standard clusters require min 4 nodes. Architect/Fullstack led clusters require min 3 nodes. Detected: ${totalMembers}.` 
    };
  }

  // Rule: Web3 Specialization Gating
  // Verified Web3 Juice Nodes cannot be hired individually or in isolation.
  // They require a full support cluster (min 3 developers total) to maintain cryptographic security standards.
  const hasWeb3Presence = team.developers.some(d => d.discipline === Discipline.Web3Dev) || 
                          team.projectManager.discipline === Discipline.Web3Dev;
  
  if (hasWeb3Presence && developerCount < 3) {
    return { 
      valid: false, 
      reason: 'Protocol Violation: Web3 Protocol Nodes require a minimum of 3 developers per cluster to ensure cryptographic integrity and sub-second finality.' 
    };
  }

  return { valid: true };
};

export const calculateCommerceTier = (provider: L2LProvider): string => {
  if (provider.commerceCompletions >= COMMERCE_TIERS.TIER_3.requiredCompletions) return 'tier_3';
  if (provider.commerceCompletions >= COMMERCE_TIERS.TIER_2.requiredCompletions) return 'tier_2';
  return 'tier_1';
};

export const calculateLearningTier = (provider: L2LProvider): string => {
  if (provider.learningCompletions >= LEARNING_TIERS.TIER_5.requiredCompletions) return 'tier_5';
  if (provider.learningCompletions >= LEARNING_TIERS.TIER_4.requiredCompletions) return 'tier_4';
  if (provider.learningCompletions >= LEARNING_TIERS.TIER_3.requiredCompletions) return 'tier_3';
  if (provider.learningCompletions >= LEARNING_TIERS.TIER_2.requiredCompletions) return 'tier_2';
  return 'tier_1';
};

export const isOfferingAvailable = (offering: L2LOffering): { available: boolean; reason?: string } => {
  if (offering.type === TrackType.Commerce && offering.team) {
    const teamCheck = validateTeam(offering.team);
    if (!teamCheck.valid) return { available: false, reason: teamCheck.reason };
    
    // GATING: Tier 3 Enterprise offerings MUST be led by a Credentialed Architect
    if (offering.tier === 'tier_3' && offering.team.projectManager.discipline !== Discipline.Architect) {
      return { available: false, reason: 'Qualification Error: Tier 3 (Enterprise) offerings require a Credentialed Architect as Project Manager.' };
    }

    // Check if team members are qualified for this tier based on completions
    const allMembers = [...offering.team.developers, offering.team.projectManager];
    const teamQualified = allMembers.every(m => {
      const currentTier = calculateCommerceTier(m);
      const tierOrder = ['tier_1', 'tier_2', 'tier_3'];
      return tierOrder.indexOf(currentTier) >= tierOrder.indexOf(offering.tier);
    });

    if (!teamQualified) {
        return { available: false, reason: 'Juice Node cluster not qualified for this settlement tier. Verify all nodes meet required completion count.' };
    }

    // GATING: Web3-specific validation for higher tiers
    const hasWeb3Dev = allMembers.some(m => m.discipline === Discipline.Web3Dev);
    if (hasWeb3Dev && (offering.tier === 'tier_2' || offering.tier === 'tier_3')) {
        const web3Qualified = allMembers
            .filter(m => m.discipline === Discipline.Web3Dev)
            .every(m => validateCommerceRequirements(m));
        
        if (!web3Qualified) {
            return { available: false, reason: 'Web3 Protocol Gating: Specialized nodes in this tier must meet baseline E.164 experience standards.' };
        }
    }

    return { available: true };
  }

  if (offering.type === TrackType.Learning && offering.instructor) {
    const instructorCheck = validateProviderForLearning(offering.instructor);
    if (!instructorCheck.valid) return { available: false, reason: instructorCheck.reason };

    const currentTier = calculateLearningTier(offering.instructor);
    const tierOrder = ['tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5'];
    if (tierOrder.indexOf(currentTier) < tierOrder.indexOf(offering.tier)) {
      return { available: false, reason: `Lead Juice Node only qualified for ${currentTier} knowledge assets.` };
    }
    return { available: true };
  }

  return { available: false, reason: 'Invalid node configuration.' };
};