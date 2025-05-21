
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemeForm from '@/components/memes/MemeForm';

const CreateMemePage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-neon-green">
          Create New Meme
        </h1>
        <p className="text-center text-foreground/70 mb-8">
          Upload your digital asset to the MemeHustle marketplace.
          Our AI will generate a caption and vibe analysis based on your tags.
        </p>
        
        <MemeForm />
      </div>
    </Layout>
  );
};

export default CreateMemePage;
