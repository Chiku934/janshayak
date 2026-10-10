export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getRemainingSlaDays(deadlineString: string): {
  daysRemaining: number;
  isBreached: boolean;
  text: string;
} {
  try {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        daysRemaining: diffDays,
        isBreached: true,
        text: `SLA Breached by ${Math.abs(diffDays)}d`,
      };
    } else if (diffDays === 0) {
      return {
        daysRemaining: 0,
        isBreached: false,
        text: 'Due Today (Critical)',
      };
    } else {
      return {
        daysRemaining: diffDays,
        isBreached: false,
        text: `${diffDays} days left`,
      };
    }
  } catch {
    return { daysRemaining: 0, isBreached: false, text: 'SLA Active' };
  }
}

export type SlaStatusState = 'SLA Safe' | 'At Risk' | 'Breached';

export interface SlaDetailedInfo {
  durationText: string;
  timeRemainingText: string;
  daysRemaining: number;
  hoursRemaining: number;
  status: SlaStatusState;
  badgeClass: string;
  dotColor: string;
  percentRemaining: number;
  isBreached: boolean;
  isAtRisk: boolean;
  isSafe: boolean;
}

export function getCaseSlaStatus(
  slaDays: number = 3,
  deadlineString?: string,
  submittedAtString?: string,
  caseStatus?: string
): SlaDetailedInfo {
  const durationDays = slaDays || 3;
  const durationText = `${durationDays} Day${durationDays > 1 ? 's' : ''} (${durationDays * 24}h)`;

  if (caseStatus === 'RESOLVED' || caseStatus === 'CLOSED') {
    return {
      durationText,
      timeRemainingText: 'Redressed on Time',
      daysRemaining: 0,
      hoursRemaining: 0,
      status: 'SLA Safe',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      percentRemaining: 100,
      isBreached: false,
      isAtRisk: false,
      isSafe: true,
    };
  }

  try {
    const deadline = deadlineString ? new Date(deadlineString) : new Date(Date.now() + durationDays * 86400000);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const totalMs = durationDays * 86400000;
    const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));
    const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const percentRemaining = Math.max(0, Math.min(100, Math.round((diffMs / totalMs) * 100)));

    if (diffMs < 0) {
      const breachedDays = Math.abs(daysRemaining);
      return {
        durationText,
        timeRemainingText: `Breached by ${breachedDays > 0 ? breachedDays + 'd' : Math.abs(hoursRemaining) + 'h'}`,
        daysRemaining,
        hoursRemaining,
        status: 'Breached',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-300',
        dotColor: 'bg-rose-600 animate-pulse',
        percentRemaining: 0,
        isBreached: true,
        isAtRisk: false,
        isSafe: false,
      };
    } else if (hoursRemaining <= 24 || percentRemaining <= 30) {
      return {
        durationText,
        timeRemainingText: hoursRemaining <= 12 ? `${hoursRemaining}h left (Critical)` : `${hoursRemaining}h left`,
        daysRemaining,
        hoursRemaining,
        status: 'At Risk',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300',
        dotColor: 'bg-amber-500 animate-pulse',
        percentRemaining,
        isBreached: false,
        isAtRisk: true,
        isSafe: false,
      };
    } else {
      return {
        durationText,
        timeRemainingText: `${daysRemaining} days left`,
        daysRemaining,
        hoursRemaining,
        status: 'SLA Safe',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-500',
        percentRemaining,
        isBreached: false,
        isAtRisk: false,
        isSafe: true,
      };
    }
  } catch {
    return {
      durationText,
      timeRemainingText: `${durationDays}d remaining`,
      daysRemaining: durationDays,
      hoursRemaining: durationDays * 24,
      status: 'SLA Safe',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      percentRemaining: 100,
      isBreached: false,
      isAtRisk: false,
      isSafe: true,
    };
  }
}

export function maskAadhaar(aadhaar?: string): string {
  if (!aadhaar) return 'XXXX-XXXX-0000';
  if (aadhaar.includes('X')) return aadhaar;
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}
