import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMemeStore } from '@/stores/memeStore';
import { useUserStore } from '@/stores/userStore';

const MemeForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState('100');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const { addMeme, isLoading, error } = useMemeStore();
  const { user } = useUserStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Placeholder function for AI caption generation
  const generateAICaption = (memeTags: string[]): Promise<{ caption: string; vibe: string }> => {
    setIsGeneratingCaption(true);

    // Simulating API call delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Hardcoded responses based on tags
        const captions: Record<string, string> = {
          'doge': 'Such cyber, very neon, wow matrix',
          'cat': 'I haz hacked the mainframe',
          'stonks': 'When your crypto goes up 0.001% but the transaction fee is 99%',
          'crypto': 'HODL the neural network',
          'matrix': 'There is no spoon, only memes',
          'glitch': 'Have you tried turning the universe off and on again?',
          'neon': 'Glowing in the digital wasteland',
          'cyberpunk': 'Living on the edge of the net, one pixel at a time',
        };

        const vibes: Record<string, string> = {
          'doge': 'Ironic Nostalgia',
          'cat': 'Digital Feline Chaos',
          'stonks': 'Dystopian Market Energy',
          'crypto': 'Blockchain Fever Dream',
          'matrix': 'Reality Glitch Aesthetic',
          'glitch': 'Error Core Vibe',
          'neon': 'Electric Dreams',
          'cyberpunk': 'Night City Rebel',
        };

        // Find matching tags
        const matchingTag = memeTags.find(tag => captions[tag]) || memeTags[0] || 'meme';

        const result = {
          caption: captions[matchingTag] || 'When you exist in cyberspace but nobody upvotes',
          vibe: vibes[matchingTag] || 'Digital Void Energy'
        };

        setIsGeneratingCaption(false);
        resolve(result);
      }, 1500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "ACCESS DENIED",
        description: "Connect to the mainframe first",
        variant: "destructive",
      });
      return;
    }

    if (!title || !imageUrl) {
      toast({
        title: "DATA ERROR",
        description: "Title and image URL are required",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting meme upload process...');

      // Process tags
      const tagsList = tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean);
      console.log('Processed tags:', tagsList);

      // Generate AI caption
      console.log('Generating AI caption...');
      const { caption, vibe } = await generateAICaption(tagsList);
      console.log('Generated caption:', { caption, vibe });

      // Prepare meme data
      const memeData = {
        title,
        imageUrl,
        tags: tagsList,
        ownerId: user.id,
        ownerName: user.name,
        price: parseInt(price) || 100,
        aiCaption: caption,
        vibeAnalysis: vibe,
        upvotes: 0,
        downvotes: 0,
      };
      console.log('Prepared meme data:', memeData);

      // Add meme to store
      console.log('Attempting to add meme to Supabase...');
      await addMeme(memeData);
      console.log('Meme successfully added to Supabase');

      toast({
        title: "MEME UPLOADED",
        description: "Your digital asset has been deployed to the network",
      });

      // Navigate to homepage or meme details
      navigate('/');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "UPLOAD FAILED",
        description: error instanceof Error
          ? `Error: ${error.message}`
          : "Connection error with the mainframe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="cyber-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-neon-blue mb-1 text-sm">
              MEME TITLE
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="terminal-input"
              placeholder="Enter meme designation..."
              disabled={isLoading || isGeneratingCaption}
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-neon-green mb-1 text-sm">
              IMAGE URL
            </label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="terminal-input"
              placeholder="Enter image source location..."
              disabled={isLoading || isGeneratingCaption}
            />
            <p className="text-xs text-foreground/50 mt-1">
              Use any image URL or try Unsplash (e.g., https://source.unsplash.com/random/600x400/?cyberpunk)
            </p>
          </div>

          <div>
            <label htmlFor="tags" className="block text-neon-pink mb-1 text-sm">
              TAGS
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="terminal-input"
              placeholder="doge, cyberpunk, neon..."
              disabled={isLoading || isGeneratingCaption}
            />
            <p className="text-xs text-foreground/50 mt-1">
              Comma-separated tags (influences AI captions)
            </p>
          </div>

          <div>
            <label htmlFor="price" className="block text-neon-purple mb-1 text-sm">
              INITIAL PRICE
            </label>
            <Input
              id="price"
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="terminal-input"
              placeholder="100"
              disabled={isLoading || isGeneratingCaption}
            />
            <p className="text-xs text-foreground/50 mt-1">
              Credits (currency of the cyberspace)
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="cyber-button w-full"
              disabled={isLoading || isGeneratingCaption}
            >
              {isLoading || isGeneratingCaption ? (
                <>
                  <span className="animate-pulse">PROCESSING</span>
                  <span className="ml-2 animate-text-flicker">...</span>
                </>
              ) : (
                "UPLOAD TO MAINFRAME"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemeForm;
