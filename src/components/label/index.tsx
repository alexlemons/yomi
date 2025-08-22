import classNames from 'classnames';
import classes from './index.module.css';

type LabelProps = {
  className?: string;
  text: string;
  title: string;
};

export const Label = ({
  className,
  text,
  title,
}: LabelProps) => (
  <div 
    aria-labelledby={title}
    className={classNames(classes.root, className)}
    title={title}
  >
    {text}
  </div>
);