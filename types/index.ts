export interface TwitterTweet {
  order: number;
  content: string;
}

export interface TikTokScene {
  scene: number;
  duration: string;
  voiceover: string;
  visual: string;
}

export interface RepurposeResult {
  twitterThread: TwitterTweet[];
  linkedinPost: string;
  tiktokScript: TikTokScene[];
  whatsappMessage: string;
  facebookPost: string;
}

export interface Generation {
  id: string;
  user_id: string;
  source_text: string;
  twitter_thread: TwitterTweet[] | null;
  linkedin_post: string | null;
  tiktok_script: TikTokScene[] | null;
  whatsapp_message: string | null;
  facebook_post: string | null;
  created_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  updated_at: string;
}
