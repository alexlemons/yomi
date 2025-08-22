import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDebounceCallback } from 'usehooks-ts';

const getRootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);

type ScreenSizeContext = {
  rootFontSize: number;
  width: number;
};

export const ScreenSizeContext = createContext<ScreenSizeContext>({
  rootFontSize: 14,
  width: 0,
});

type ScreenSizeProvider = {
  children: ReactNode;
};

export const ScreenSizeProvider = ({
  children
}: ScreenSizeProvider) => {
  const [rootFontSize, setRootFontSize] = useState(getRootFontSize());
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = () => {
    requestAnimationFrame(() => {
      setRootFontSize(getRootFontSize());
      setWidth(window.innerWidth);
    });
  }

  const debouncedHandleResize = useDebounceCallback(handleResize, 500);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    debouncedHandleResize();
  
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    rootFontSize,
    width,
  }), [
    rootFontSize,
    width,
  ]);

  return (
    <ScreenSizeContext.Provider value={value}>
      {children}
    </ScreenSizeContext.Provider>
  );
}