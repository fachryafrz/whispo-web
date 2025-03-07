import { Card, CardBody } from "@heroui/card";

export default function ChatMessages({ messages }: { messages: string[] }) {
  return (
    <div className="relative flex-1 overflow-y-hidden before:absolute before:inset-0 before:bg-[url(/background/doodle.avif)] before:bg-[size:350px] before:bg-repeat before:opacity-10 before:dark:invert">
      {/* Messages */}
      <div className="relative flex h-full flex-1 flex-col-reverse items-center gap-1 overflow-y-auto p-4">
        {messages.map((msg: string, i: number) => (
          <div key={i} className="w-full">
            <Card className="w-fit max-w-sm bg-white dark:bg-black">
              <CardBody>
                <p className="text-sm">{msg}</p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
