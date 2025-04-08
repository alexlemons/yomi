import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export const RootFontSizeContext = createContext<number>(14);

type RootFontSizeProvider = {
  children: ReactNode;
};

export const RootFontSizeProvider = ({
  children
}: RootFontSizeProvider) => {
  const [rootFontSize, setRootFontSize] = useState(14);

  const handleResize = () => {
    requestAnimationFrame(() => {
      setRootFontSize(parseFloat(getComputedStyle(document.documentElement).fontSize));
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <RootFontSizeContext.Provider value={rootFontSize}>
      {children}
    </RootFontSizeContext.Provider>
  );
}