export type KycStatus = 'unverified' | 'waiting' | 'approved' | 'rejected';

export const getKycStatus = (user: any): KycStatus => {
  if (!user) {
    return 'unverified';
  }

  const rawStatus =
    user.kycStatus ||
    user.kyc_level ||
    user.statusKyc ||
    user.verificationStatus;

  if (typeof rawStatus === 'string') {
    const normalized = rawStatus.trim().toLowerCase();
    if (['verified', 'approved', 'completed', 'success', 'done'].includes(normalized)) {
      return 'approved';
    }
    if (['waiting', 'pending', 'in_review', 'review'].includes(normalized)) {
      return 'waiting';
    }
    if (['rejected', 'declined', 'failed'].includes(normalized)) {
      return 'rejected';
    }
  }

  if (user.kycVerified === true || user.isKycVerified === true || user.kycStatus === true) {
    return 'approved';
  }

  return 'unverified';
};

export const isKycVerified = (user: any): boolean => {
  return getKycStatus(user) === 'approved';
};
