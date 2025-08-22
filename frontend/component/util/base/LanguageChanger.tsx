"use client"
import {useLocale} from "use-intl";
import {routing} from "@/i18n/routing";
import {usePathname, useRouter} from "@/i18n/navigation";
import {useParams} from "next/navigation";

export default function LanguageChanger() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname()
    const params = useParams();

    function changeLocale(locale: string) {
        router.replace({pathname,query:params}, {locale: locale});
    }
    return (
        <div>
            <select
                id="package"
                name="package"
                defaultValue={locale}
                className={"rounded-lg ring-1 ring-primary/70 bg-white text-primary p-1 focus:outline-0 focus:ring-3"}
                onChange={(e) => changeLocale(e.target.value)}
            >
                {routing.locales.map((option,index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

