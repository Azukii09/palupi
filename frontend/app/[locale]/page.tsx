import {useTranslations} from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1 className={"text-red-500 font-bold text-3xl"}>{t('title')}</h1>
    </div>
  );
}
