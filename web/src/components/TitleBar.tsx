type TitleBarProps = {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
};

export default function TitleBar({
  title,
  subtitle,
  extra,
  icon,
}: TitleBarProps) {
  return (
    <div className="flex h-fit w-full flex-col justify-between gap-2 py-2">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <div className="flex gap-1 align-middle">
            {icon}
            <h1 className="text-3xl font-semibold">{title}</h1>
          </div>
          {subtitle && <p className="text-lg">{subtitle}</p>}
        </div>
        {extra}
      </div>
    </div>
  );
}
