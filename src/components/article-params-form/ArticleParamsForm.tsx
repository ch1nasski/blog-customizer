import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
} from '@/constants/articleProps.ts';
import { ArrowButton } from '@/ui/arrow-button';
import { Button } from '@/ui/button';
import { RadioGroup } from '@/ui/radio-group';
import { Select } from '@/ui/select';
import { useOutsideClickClose } from '@/ui/select/hooks/useOutsideClickClose';
import { Text } from '@/ui/text';
import { clsx } from 'clsx';
import { useRef, useState } from 'react';

import type { ArticleStateType, OptionType } from '@/constants/articleProps.ts';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [formState, setFormState] = useState<ArticleStateType>(defaultArticleState);
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useOutsideClickClose({
    isOpen,
    rootRef,
    onChange: setIsOpen,
  });

  const handleArrowClick = (): void => {
    setIsOpen((isFormOpen) => !isFormOpen);
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
      <ArrowButton isOpen={isOpen} onClick={handleArrowClick} />
      <aside
        className={clsx(styles.container, { [styles.container_open]: isOpen })}
        aria-hidden={!isOpen}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h1" size={31} weight={800} uppercase>
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
              name="font-size"
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
            <div className={styles.separator} />
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
