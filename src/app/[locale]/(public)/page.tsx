import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, generateSlugUrl } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import envConfig, { Locale } from "@/config";
import { htmlToTextForDescription } from "@/lib/server-utils";

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "HomePage" });
  const url = envConfig.NEXT_PUBLIC_URL + `/${locale}`;

  return {
    title: t("title"),
    description: htmlToTextForDescription(t("description")),
    alternates: {
      canonical: url,
    },
  };
}

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const t = await getTranslations("HomePage");
  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="w-full space-y-4">
      <section className="relative z-10">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhISEhMVFRUVFRAVFRUVFRUVFRUPFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBEQACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwEEBQAGB//EAEQQAAEDAgMECAEJBgUEAwAAAAEAAhEDIQQSMQVBUWEGEyJScYGRodEUFjJCYpKxwfBTcoKi0uEVJJOywjNj8fIjc9P/xAAbAQEBAQEBAQEBAAAAAAAAAAAAAQIDBAUGB//EADcRAAICAQIFAQUHBAAHAAAAAAABAhEDBBIFITFBURMUImFxsTJCUoGRofAkwdHhBiMzNENi8f/aAAwDAQACEQMRAD8Az2OWjI2UAICAezwQowHwQBMegGU3oQ0MNX3IC0BKArYhAefx1W+q0gZDnTKoEFyoG0ygLLXIBgcsmiw1CliggLrRosgsUSoCwAgGNKgOLlAA8oAWu5IAS/kgOB5LQHUxZACdUBawzhwQF6nVCgCfXCgK9bEgXsgKNXaHJqAo4uuDuCqRGZVVy2iGVjNYH6C0GJyhCGi1ywWgs/NChNPNANB5oAx4oAm+Pugoax3P3QUOFQDf7oSh1PF8/dBQnFYy2vuqKMLE1ZKoopEXPNUCi1UHAlCBteUA+nUKhotUnqFNLDsUYLbQoAwVAWGPQBFygFmooCc0oAXyqBQJ/QQDmOQBsqoAS88lSBGqgDp1p/8AKgGOrIDJxWMkkBVIhUNQqgq1sQVaBLT2ZKtAo1BxVAvIhC8QOKwbOa0IC0xg5IBjWDkgDyDiEIdkHL1QAkBAKeUFgqgRVatJgrOpqlK76aEB6pAAaaA4MQDGNQFyg1Rg08OYWWUttUAcKAYwoCXFQFZ7roDm1bwgHgoAXA8SgDAPEoCL8T6oAmMcd59UINNI8SgFmmeJQAVKZ4lUFV9E8SrYK1ZhB1KpCnVpE71UDm0nRBK0CnVpmUIBkKhLNDqbTfwhYOhDGDigNHDYRztLoCx/h7t4Klgk4E8E3AF2CPBNwFHCFNyADsCeCbkQW7AuSxRVq4Q/orSLRX+RPOgnwBP4LVkK9XCuaJMBVMCQ0neFaBJouCUBZaUoBslQtFzDyjQo0KRKzRS2wlZYoaHFQB5ioCJKATVlACxpNwgGtzIQPI7mgGMY87ylgLqXcSlihjM3FCDjm4oACHIQScx3oBVWeKAz8XVK0gUyX79/gtJAZJhUFWo1xKpKAyOUJR6XbuzeoeW7j+gVyUjoYhMFaBudH8rngHRYm6QPolHZtGBBeORP5Qs9QS/Y9E7z7fBNpbFHYVLvH2TZ8RuYP+AUe97hNvxG5g/4BR7/AOvVNo3Mg9HqXfHpP/JNo3MRiNi0GCXVmM55WD0krSg30FmFtRuEaDmxVV32abTf3AXWOCbJZ4PGOYXuLBUjtDtBpMG2uf8AJfRhp8UV78kCuKP2SYHeA/Iroo6XvIUw6TCCIa4eFWPXsI1pfP8AP1G2RYpucJOTNJE5ntJtz6vRZcdL+IbZDxUFz8nFv+5r4SFfS0vaYqQ8PZ+w9C0/BX0dP2mv5+RNshrKw3U3ejP6kWnw/jX7/wCC1IL5T/26n3Wf/otrSYH99fr/AKFyGU6p/ZnzcJ9AD+K8+TT6eP8A5P2se94GCqZ+hHnPwXnlhw9sn7F97wMqVRlmYPdywY4yLe65egrpSRLfdFJ9Uc/Rb9jydlfyG5FvCMBIvaxMeErz5MU49UVO+h7XY2xg5mbNO7tAFceZWXnbBb9n7sfgm2XkWgfm837Plm+KbZEsk9HmcR7q7WSyB0bp7z6JtYJHR1nE+gVpgn5vM4+ytAh3R9v1SB5fEJQPFdI6DqTi3MZuN35IuoMCiLy4+K6Iyze2HsZ1c52lk3Aa+D2eOVSToqo239EKh+rQ8g5v+1YbZbQg9CHzozyc78wVVJjkF8yX8G/e/sruYpHmtqbYdVnM0EneZJ9VzWNp9Tq5fBGGSV2SOJbweLLSCpKNmj09DpZUiC533iubg+zNJrwWG9Kqnef6rPpz8l3L8IXzsqd53r/ZPTn5Luj+Eg9LanePqPgtRw5JdGN0fwgjphUmJdPC3vay9ceH5ErnKiepH8IvEdKa7hGcie7Y+uqOOKPTmZo87XxVydTxN0eeTVIqiipVrSuLyMu0o5llyNHZ9VNxQmOS2Dq+JyjmVHI92g0MtXk2rkl1YFPFO3m/oArubOmthpsM3jxJuurb7/Ci1hcVMg7t6zuZdXoPSwwyrpJdPBbZWTez5yiMFZX1GShra6w5M7xwS2b7SQXWLNnKggdFdxKJsqskl0ZlosUqTeC7R1WRLqZ2I9DsjbLqQyiHDWD+RWJZN3Nomw1R0oHc9CrGmZcTvnUzu+61OE49iUjh0pb3fdctz8CkC/pYzu+5TdLwKQDul7O77lN0vBaXkH54U+HuVN0vA93yRU6X0o0/mcm6Xgnu+Txm2doiq+dBeBfeZ3lajGnZHRmiLTpvXWyHrejW3qdBpbrJm4Ihc3uOlQ8m587mcB6n4LPveBUPJB6X0+A/m+Ce/wCBUPP7HfO5nAfzfBPf8F2w/F+x8tdi3n6xXWjNiXVSqZI608UKNp4lw3j0CUBwx7uX3W/BNpDvl7uX3W6nyXbHg3ukLCFdzrW5kACOTSPx9OJ+jtx6ZeWOobHRovn5tRLI+bNqNEGqvK2aor1HqChD3aoWhQUYJc2y57+dGqBD1pMA1bxyhSTPscIzvDklzSTVO/2a+QDn8o5qOZ7dLwjHPJu9RTS50urJB7MN36lXlR7IylqNV/UR2xh0i+7+jGuJlrRIG88fNYbOWkx4sjy6jJFOvsx5dPkMNVxdluAPdWznp9Ljx6eWpnFSk+keyt+CxhK0k8tyz3JrdMsWmjaTnLul/Ohap1SpuZxzaPBhwxUvtP8An6DqTyiZ49fixY9sYL5jM6tnzGOp1EsyNbVVsDG10IESDPFd8eeUPkZcbEvqlut16lCGb7HJ+Dm7iJdihwXncKdMWIfiOSm0liziBw91No3MF+JbwPmVaJbFGoDyWqFi2VY3SgLVLEjuj1QtlluKb3ff+yUW14COJb3Pf+ym1+RuQPytvd/m/slfEu489mVMgZkB0oCWuWkAs62kBlEWzbyco5D6x9CB5ngvq4ILHBzZjq6LDXr5ebI5ytnZKi9s3Zz6xcGR2QCZmL6aDkvk67iGPSRTyXz8HaGNy6A0tmVHVXUmwXNmb2sYN45rlLieKOBZ5Wov9S+m7oXV2bUFXqsuZ9rNvqJW8XEMOTF6ydR+IeNp0Wz0VxEaM8M1/gvC+PaROrf6G/RZh4vDvpOLHtLXDcfxHEL6eHUY88N+N2jm4tcj1GxtoVX4OpQNB1VoDgHhwGUEZhY6kG9uS/OcR00MesjnWRRfJ0+9HSPQ8e4r9NF8jLQ3EYGqwB72ODTEEixm4XKOpxTm4Rkm12OsMmSCqLaJp4Go5heKbiy8uyy22t1J6nDGWyUlfiztj1eojzjL6HYbCPcYYwuP2QT+C1LLjgrk6O2XiGozRUZu6+CDrYaoz6bHN/eBH4qQz48n2JX+Z53mn3S/RC21Su1E9d+F+g+lUKy+Q9dtVX1/yOD1L+JHlvqvr/kfRco3RlztVQ0hY3p9zG1htctbkZaDDk3Im0MuV3E2htq6KqQ2kl8i66Rm1zRlooYkRPBfTg1qI/8At9TzyW0q5159tAhz1gAtK0AkISGJRQxSKUBoCgIeVABlKAyJQpKA4lVAguWwDnXXEuZC7P0RwZT92hx93FfS1fuwUSxXMmV8WR1PadDaMUnO7zo8mj4kr8T/AMR5bzRh4V/r/wDD24FybLGxdl1KdStUqRLzaDNiSTPsvDrtbjy6fHix/d6/odIxqTYnYfbxGKq/aDAeQn+kLetfp6LDj883/PzMrnNlTZmNqVMdUGd2RvWdmTlyjsi2msFejNpsWLhym4rc65/Mik3KjP6bma7WgXDGjzLnL18AuOGT+P8AYxl6ns9gYZtCjTomMxBcRxdYu9JAX57iWeWpzyyLouRUqR8u2thurrVafde4D92ez7Qv22hz+pp4T8pHNrmfSMZsvrcOaO/IMvJzQIPrHqvxcNU8WpeVfid/Jnoq4mZs9uTZjwRBy1gQdxzEFe3VT9TiMZJ/hMr7IWEqdRgg9gE5M3i5x1Pr7LOpvUa305PldHSPKNlV+2KVbCubVc3rC1/Zg/TE5SOB0Xb2PLp9UniT2prn9SbrXM8aWr9gpHlPR9CR/mP4Hfkvi8ek1puXlHTGrZPShv8AmX/wf7Qs8Fk3plfllmuZqdD6DCHuIBcCAJ3AheLj2fJHbCLpMQRoYHaDcQ59N9NsNkib2mPVfMzafJpoRzRm+Z0F7GwLOsr0y0HK4RIB7Jld9brcssOLIpNPndcjKSF4PZ4pYk03AFpaS2RMjX1EFds2vlm0SnF1JNXQUeYWFwTDiaoIENGZrd143eak9dmjoYOMud033JtVlgVqD6j6LqTRl32E6abxqvKlq4YVqI5Hz+LLyujAx9AMqPYDIEQeRAK/W8O1Lz4Izkqfc4TjTKz2SIX1sE3CSaOMlapmaWXXu1MEnuXfmeZeBdQLylABVA2k1AWqbUAzKgJyICWUJN1G0jUYtukO6gC0KWalBxdM8vKhkjOgAe9aSAvMtAIFejD1IXqj7g8W0z/I2fefRe/XL3U/mIEB118WR2R76k7qMCHaHq5/if8A+y/n+q/qeJOPbdX5I98Pdxh7BrOGF6x7i7/qPlxJgC0X/dXLimKC1fp41XRcviWD5WR0OaPk5dqXPeT4wAB7e61xp1mjDsoomPuyp0V2XVp1KtSq0tJGUTF5Mk+wXfimsxZMEMWOV1/ZCEediqOHFfaD3G7KWXwzNAAH3pPktxzPTcNVdZX+/wDoklcz0D8MHYhlXrR2GuZ1dr5pm866bty+LHKo4JY9r587NUeP6Y4OMYw/ter+8DkPsGr9JwTPellF/dv/ACcprmeh6R7W+T1cK7dnfm/cgA/jPkvjaDSe0xyrvXL5nR8kWOlNQDCVoAAgG3FzxJ9SuPD1J6qCfn6InYzsaw/IBAJ/+Kjpe3ZleyDT4hz/ABM6/dHU6jauEdUdTa05KloB+iDBkjkueVTw6pQjNvmv3J2PAO3+JX7eJ5meh6Gf9f8Ahcvjcd/7b80bx9RnSoRiHeDPwj8ly4JL+n/NmsnU0uhDrVR+5/yXj4+ucH8yQB2HbFVR/wDaPR6zraloYP5fQ0upp4M5cZVHeY13pAXgyLdoovxJl7jqGJD6jmO+nSe4t4mm635/guUsUoYlOP2ZLn80OoqYxYPfpkeYP9l1j72ikvEl+5H1KmMp0hiSKrZzinl5O+je/JezTZM70f8AyX9lu/l1I0rKu3cE2k5uQQHA2km4N9fEL6nA9ZkzqUZu2v7nPIqM0L9DE4sp1x2ivr5OeCD+Z5JfbYh7QvGAGtugHMF0BbptQDQxQBZFLATbKNWdMeSWN7oumSTOpU2ieRze6XU8aXqmWLc5aRAMy0UIFUgUrcXQLNB+ZuX6zMxA407ucBzBk+BPBfYjWbFt/n8ZE6Zwevj5cTi2jumWcTtqu9vVveS21oG7TcvlY+F6bHk9WMfe82+51eaTVMkbcrin1Qf2Iy5YH0fGJXPJwrTTy+s4+9d9Qs0kqR2zds1qM9W8idRYg+RTV8Owan/qL8+5YzaLuI6WYpwIzxPdaAfULwQ4BpYu6b+bOnqMTs3pDVoNLWBnaMkuBJJ8Z/UrrquFYtRW5tV0oqm0ZbMe9tQVZlwcHye9M3Xqejx+n6faqJuZe2l0nq1nUnvayaTszYBEmQYMnTsheTS8Ix6dSUJOpKg5tidt9IauKLDUDRkzRlBGsTMk8FvRcLx6S9jbvyRzbLOI6UVX4cYdzWxDBmvmIaQRO7cFwhwfHDUeum/NduZrfyofsfpdVosFMta9o+jMggcARuXPWcFx55706b6ljkosbT6XVKzCwNDGu+lckkcJ4LlpeBwwzU5SujTyWYnWL7qXI5mlsPaYoVM5bmsRExrzXh4hpHqcOxOip0z0FTpXh3Xfh5PE5HH1IXw4cF1cOUMlL8zpuRmYPbopVnVKbYY7Vmgjy0X0MnDJ5tOseWXvLuZclfI3mdLMPd3UEPIuezJ8Xar5MuCav7G/3RZmYfb/APmDWeDEFuVu5sW11X0JcIktJ6MX712XcRidrg4jrqcgdmxi9gCLLpp+Gy9l9DL159Cbudlnam3GudTfTBDmTrG+LWPiuGi4RkhGcMtVLwJTXUuN6RYd2U1KZzDQwHQeRMLyvgusx2sUuT+ND1I9zP2vtcV3NyghrZidSTEz6BfW4RwyekuU3zZic0+hTa7VfehHmcWVnukk/qF9fUrbjjDwjyXcmxTgvCU4KAZTCAsUyoCwEBJKAiVGCJCgPF1AhQCtIhCoCaVQFK0ikBxBBBggggjUEXBC9eHLsZGi0QHDM0RvewfV4uaO7y+r4L35ccc8bXX6/wC/r8xF0IXx8mNxdM6pnFcaKGxsmAsM6wjudFpmHaLvMgbmwb8M2npK8s8z6RR9jDoFW6bAe1h3EcO1b3CxeSPWj0vSYp8oqviUntuvRFqrPkZMLUmkLeDotHFxadMHKoxtbOAUI00EEA9u5ZoqHNaVHR1WKTVpEoZcWcZGv6BRJBwa6hUwUaRVCT6IeAYWbRr0ZrqhraZseM+g1P4rLlE7x0k3FPyWWU7cwT/x+K5vIlI9kdFuxU+TQEr0JHxsi2ugZXRROTY6jortCYdavGi+npdOor1J9Dlkl2QljlzzZHOVnJIJ5XApDSoQsNQDWKAsByAkuQCXOUYFZ1Aef6rMpZoqVGEWK0iAFbBEoDpQHStpgOnVLSCCQRpFjPIr04szg7BabVY76XZPeaOz/EwaeLfQr2epjzKpdRdEPokCbOb3mmW+e9vgQCvPl0b6x5/U2pJgNdqvnzxtdTvF0HTxDm/qb/kuE8SkfQw6yUOobMXrOvG48pBkDkIXnnpvB9LBxCL6jKmNbBizjN75o0EnSI4e65+lO0ux2nmxbXLuVKVLMSSYAEk8pAtzuAvRJ7UfJjD1pttj6VXutIbp2fpOdwL9fIei4ST7vme7DGP3VSDxFG9wC50uMHssGv6OlliE+18kXNo93NLmxRwZP0YMxvESdACdV1WaPc8uTh806iRSpEuDd66OSSs8+PA3kUS8zNmbqGt0BOpNgDzJF+AngvK0mr7s+2lJPbVIjqNJtM62HInh9Y+AV9Wkc1oYuVi8YAHECbWnwsuuFtq2eHXQjGXIdSBDOz9LW2uW7beYPqFifOdPoejBHZhtdWS0hoLXETJ372wBp+8fRZkm2tp1hGO1+oyflQ3CRex4WgDwgKrDJ9RPVYox5dSDXJ/X64LvHEkfNy62UuSGNeuqgeCTs4OC9GPBOb91HJtAvrgTHt+Z+HsvfDTQxK8jt+DjLJ4EiosZs7ny7GBrai8pQi5ZIEwqAcxygLLEA6UADnICvUeoyAyoDMpaLDZ0aBr0Q4c9yJ0SjMeIMFdk7MgEqiiCUFESqCcytghzlpSAyjinNuCQeIMH1C7Y9RKJUPGMB+k1pneOw7yy9nzLSvT7TCfKSKk10Iz0zoXN/eaHAeLmmf5VfRwT6M3vkiRSmYfTP8Yb7PylYlob5xZpZqBOFqASWOjjlJHqLLyy0k0dVmT7i6eILTYxaPLgQuM9LJrmjvh1Dg7RzsW4kGb3A5A8OC5vSV2PT7bIL5W/fBtEECItqIubC/Jc3pF4O8eJTQ/5c4nNaZJBvIcYki8bvLdCx7H8zT4k6dAMrlrgRqNF1enbVUeOGocZ7htPFWgtbl3C4APKCs+ydz3viTl1QdGsBNgZIN51Fx4jlyCktK2guI0+gD36rawtLofOzZdzsl1UlwvujyAT2d+C+1SSVM4HiV0jppvojlLO31ZZDCIsRzIgepsu0dDlfY4vNHyLNQX7QHnP+2V2Wir7bOTyrsScQN0nxsPQGfddEsGPtZzcpMW6sTabcBYf381Jap9I8kYryCai8rm31ATXrIGNegGNeskHtcoB1MqAf1iANtRAEUAhyhCIUBmrkdSJVBXxFHMOaqdEaM54iy6pmQStA4FUEoAXFALlUHZks0jsxVUinZytKbQJa+DIkHiLH1W1qJruB3y+r+1qf6j/AIrftUhtid8vq/tHHxM/intMhsiR8tfxHm1h/JPapF2oJuLd9n/Tp/0p7XIuxBDGO+x/p0v6Vfa5DZ8QhinHu/6dP+lX2yRVBeQnYg8GeTKY/Bqq1svgNnxF/KnfZ+634Ke2TJVEtxTu97AKe2ZPI2ocMW7vu8MxUesyeRsiLzhcpZ5y7ikiOsWN7IS1ylkY0OCzZDgVbIEHJZAg9QDabkBYY5Qg1rlAOBQEtfCAfTfKyCHOQCs6AzyuB0IVQIK0CtiqIIkarUXRGjPK6WZohaBLSgJIUAt7VQCENIippKWUXmSwQXJYBzq2Ds6BBNcoaJzqAnMhQ2uQoWdC2BmQjJBVIMDlAdmQgykJ8EIGHoQNrlQEChlkoQNAMCgGMKgHNehBzXoA5QBU3rIGkoBRUBm08Q12hXKmdBqA6FS0QWpZSni6E3Gq3GRlooFdSESqSgmuUFHOUstCyhaJlSy0czDzeU3iifk3P2UeQu075EO97KeqNoYwDe97LPrfAqiW8Psdh1qEHwH5lcpaprsdY4r7jf8AAmftPwWPbH+E16HxKtTZgH1p8CCusdRfYy8VCfkfM+i36qMbDvkfNPUQ2EjBjir6o2s44XmnqDaweqWt5KByhXcZoIK2SgwEsgbVQEClmWEHJZAwUsDGlQD2lAFKjBzXoBzailkGMcgGByA7OgPKuBB4JdlNbY+3X0PqU6jd7alNr/RxEjyKlCzfpdMaZ1wmGH8FlhxZpMsfOZh0wmG+4Fh2i0YWOqh73PawMBvlbOUHfE6DkqmUysXh/rDzXWMiNFQroQ6UATGEwBqdFi6KkTVoFpII0UsoyngKpbmFN5be4aYtrfyWHlgnTaNqEn0Ro4HAlmcPbeRx0hcZ5U/ss6LG+5YNEd38Vz9R+TWwjqh3VN78jYcKQ7qjn8SqBPVjurO5+TVHdX9lNzFEGn9lNz8iiOq+yFfUY2hNofZHsnqfEbTRwWBadabZ8BqvNl1EkuTOkcafYt9MsPSp0KLWU2Ne9znEhoByNERI4l3suPDc+TLklKTdE1EYx5JHi6hgL7iPI2V+fFaTMs19jYI1arGMjMSIkwJ8dyzKVEO2rgTSe5jolriDF7gxqikQrhoV3AVVF+C0mQEKkof+vRWyDBCMhMqAIFASECHAEaqWitDGOVIOCA6VAYU9q/BZQor2jnJ8IW7IAqimngWw3xXKfU3EsysGhZVsFLEUIuNPwK6RlZlorELRDQ2BRzV2A6CSfCI/Nc8jqJuPU3MbhsroGm48lzTBpdGaNOq40apdcTTGchuYXIIHH8l8/XxcV6kUrPVgl91icdgAxxbGht4HT4eS8+DUepGz0zxpFJ1EL0qRycSOqCtkojqVNyLtCbhXHRp9CsOcV1ZaOOFePqu9Cp6kPIoWWLV+BRHVq2KObRV3CjW2ZgWuc0FsyfaP/C8mfO4xbOsY2Z3S5jW13U2TlYGtuSe1EuiTa5jyXq0NuG59zzZXbPO1m2X0Ezi0V3sIAO4zHlHxXVHNnocBgndhwBuGkc5Flym+ZUJ27LDDtTPlBUgJGc2uJXWjmKqvBNlpA5rlowww9CoawE3CNoUE0pZBrQlgfhX5XA/oc1Gaj1L+MxuYEGDOloymQSbeHuuS6npyRhttFNpXQ8gWZC0RnQUedL0Qsa+kA0HMCTOhuORG5UgFJskAbzCtg9Pjti1KDW58hBt2KjH355TZcZdTcSkQsmwSFSAEJYKGJpQbafqy6pkNPoxT7T3cAB6rlmfQ3BdTarSbEaLkmKEUnlrg5pgggg8CEmlJNM1F0z1O02NrUWYhupHbHB31h+a/P7Xp8ux9GfRhPfE87UAXvjIxImiGyJ03qyk65EouVMYG2YB4wvEsMp85t/I0jmis4ZhJHkueSGmg9suv5mgabK5vDvOFlrSrwOYIxR0cA7xF11enVXBtF+YnFUmA9nQgHwncumKc2vf6kaQpjF33EPRbFbBzOFmtLj4an/avn6p7ltXdnWPJWeJx9Uve951c5zj4uMr7uFbYpHz5dTJrG69CObJxL5a0d0m3iB8F1izEjV2Vtw0zSz3a2B4NAgeMWWJxvoRMo7d2gKtQvaCGkCxixNzotY40STsz8wt7rrRkJqEClUhLShDf6PYbrA4S0bzmIEAeOq8Ws1UcEU5J/kdIxszKjhJjSTHgvVB3FMzQTXrRAg9CBtchQwVATKAHMgsxm0iXBo3oRIh7SCQdQSD4hVAt7HoZ6rQdJk+AEqTdI1FW6PUnA0u7/M74rxvJI9PpoFuBpX7O/i7h4pvZNqH0sFQ0LL+Lvim9k2hOwVHuD1d8VVNjaee2rSbnc1oAFhHOLrrFmJD+j7C1rjIubWvbiVjLK2aguRoOfK52WhVccE3CjW6K7Qh5w7z2KsC+jan1T56ei8etw+rC11R3wy2MTtXCOpVHMcNDbmNy82Ge5fE9Ml4KOZegwSHIBtOsRoSPArjLHGXVGkwhiXECXHQbyuawY0+SRbALl0SFkFy0B+GbJFlmb5FRr42rkw1Q73xTHnr7NcvHigp54/DmayOoHkjSzS0C5X206PGzDyXXpg+RxYeKaMtuI/AraMMqXPl7LZgErSBMK2AwhCQUM0SEBqYbarm0zThpaQdWtJBIy2MSLAei5zjbOsZRQihhnPByiY189PzVuhHG59A8JZxBBJE2g6zEELTZxkWtpYdrQwiQXZuyeAi54am3Jc4zt0YjNPkU2OWzY4FASlgiFLB//9k="
          width={400}
          height={200}
          quality={80}
          loading="lazy"
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">{t("slogan")}</p>
        </div>
      </section>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">{t("h2")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${generateSlugUrl({
                name: dish.name,
                id: dish.id,
              })}`}
              className="flex gap-4 w"
              key={dish.id}
            >
              <div className="flex-shrink-0">
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={80}
                  loading="lazy"
                  alt={dish.name}
                  className="object-cover w-[150px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="">{dish.description}</p>
                <p className="font-semibold">{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
