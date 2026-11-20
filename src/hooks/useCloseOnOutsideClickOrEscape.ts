import { useEffect } from 'react';

import type { RefObject } from 'react';

type UseCloseOnOutsideClickOrEscapeParams = {
  isActive: boolean;
  rootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

export const useCloseOnOutsideClickOrEscape = ({
  isActive,
  rootRef,
  onClose,
}: UseCloseOnOutsideClickOrEscapeParams): void => {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleMouseDown = (event: MouseEvent): void => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, rootRef, onClose]);
};
