export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  formRef: React.RefObject<HTMLFormElement>,
) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
    e.preventDefault();
    formRef.current?.requestSubmit();
  }
};
