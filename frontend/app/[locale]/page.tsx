import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Link} from "@/i18n/navigation";
import Navigation from "@/component/layout/navigation/Navigation";

export default function HomePage({params}: {params: {locale: string}}) {
  setRequestLocale(params.locale); // optional for static rendering

  const t = useTranslations('HomePage');
  return (
    <div className="p-6">
      <Navigation/>
      <h1 className="text-2xl font-semibold text-primary">{t('title')}</h1>
      <Link href="/about" className="underline">{t('about')}</Link>
    </div>
  );
}
