export interface IPagePlaceholderProps {
  /**
   * Page heading, usually the nav label of the entry that points here.
   */
  title: string;
  /**
   * Short note shown under the heading while the page has no content.
   */
  description: string;
}

const PagePlaceholder = ({ title, description }: IPagePlaceholderProps) => (
  <main className="flex min-h-full flex-col items-center justify-center gap-6 p-6">
    <h1 className="text-2xl font-semibold">{title}</h1>
    <p className="text-muted-foreground">{description}</p>
  </main>
);

export default PagePlaceholder;
