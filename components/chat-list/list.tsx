import { Button } from "@heroui/button";
import { Image } from "@heroui/image";

export default function List() {
  return (
    <ul className={`h-full overflow-y-auto`}>
      <li>
        <Button
          className="flex h-auto w-full items-center justify-start gap-3 rounded-none border-b border-default-200 p-4 text-start dark:border-neutral-800"
          variant="light"
        >
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">HeroUI</p>
            <p className="text-small text-default-500">heroui.com</p>
          </div>
        </Button>
      </li>
    </ul>
  );
}
