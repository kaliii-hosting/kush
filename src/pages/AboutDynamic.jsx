import { usePageContent } from '../context/PageContentContext';
import DynamicSection from '../components/DynamicSection';

const AboutDynamic = () => {
  const { pageContent, loading } = usePageContent();
  const sections = pageContent?.about?.sections || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {sections.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}
    </div>
  );
};

export default AboutDynamic;