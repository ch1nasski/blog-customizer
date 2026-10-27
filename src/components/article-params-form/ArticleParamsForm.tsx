import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { useCloseOnOutsideClickOrEscape } from '@/hooks/useCloseOnOutsideClickOrEscape';
import { ArrowButton } from '@/ui/arrow-button';
import { Button } from '@/ui/button';
import { RadioGroup } from '@/ui/radio-group';
import { Select } from '@/ui/select';
import { Separator } from '@/ui/separator';
import { Text } from '@/ui/text';
import { clsx } from 'clsx';
import { useCallback, useRef, useState } from 'react';

import type { ArticleStateType, OptionType } from '@/constants/articleProps.ts';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const closeSidebar = useCallback((): void => {
    setIsSidebarOpen(false);
  }, []);

  useCloseOnOutsideClickOrEscape({
    isActive: isSidebarOpen,
    rootRef,
    onClose: closeSidebar,
  });

  const handleArrowClick = (): void => {
    setIsSidebarOpen((isCurrentlyOpen) => !isCurrentlyOpen);
  };

  const updateSetting =
    (key: keyof ArticleStateType) =>
    (option: OptionType): void => {
      setFormState((currentState) => ({
        ...currentState,
        [key]: option,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(formState);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={rootRef}>
      <ArrowButton isOpen={isSidebarOpen} onClick={handleArrowClick} />
      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isSidebarOpen,
        })}
        aria-hidden={!isSidebarOpen}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <div className={styles.settings}>
            <Select
              title="Шрифт"
              options={fontFamilyOptions}
              selected={formState.fontFamilyOption}
              onChange={updateSetting('fontFamilyOption')}
            />
            <RadioGroup
              title="Размер шрифта"
              name="radio"
              options={fontSizeOptions}
              selected={formState.fontSizeOption}
              onChange={updateSetting('fontSizeOption')}
            />
            <Select
              title="Цвет шрифта"
              options={fontColors}
              selected={formState.fontColor}
              onChange={updateSetting('fontColor')}
            />
            <Separator />
            <Select
              title="Цвет фона"
              options={backgroundColors}
              selected={formState.backgroundColor}
              onChange={updateSetting('backgroundColor')}
            />
            <Select
              title="Ширина контента"
              options={contentWidthArr}
              selected={formState.contentWidth}
              onChange={updateSetting('contentWidth')}
            />
          </div>
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
