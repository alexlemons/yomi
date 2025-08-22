import { Dispatch, SetStateAction } from 'react';
import { Tag } from '../../types';
import classes from './index.module.css';

type TagSelectProps = {
  onTagClick: (tag: Tag) => void;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedTag: Tag;
};

export const TagSelect = ({
  onTagClick,
  open,
  setOpen,
  selectedTag,
}: TagSelectProps) => {
  const buttonList = [
    selectedTag,
    ...Tag.filter(tag => tag !== selectedTag),
  ];

  return (
    <div className={classes.root}>
      <h4>T</h4>
      {buttonList
        .slice(0, open ? buttonList.length : 1)
        .map((tag, idx) => {
          const first = idx === 0;
          return (
            <button
              className={classes.tag}
              key={idx}
              onClick={() => {
                setOpen(prev => !prev);
                if (!first) {
                  onTagClick(tag);
                }
              }}
              style={{
                background: tag ? `var(--tag${tag})` : 'none',
                border: `1.5px solid ${tag ? `var(--tag${tag})` : 'var(--dark)'}`,
              }}
            />
          );
        })}
    </div>
  );
}