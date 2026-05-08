import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
  fallbackName?: string;
  onUploaded?: (url: string) => void;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

const AvatarUpload: React.FC<AvatarUploadProps> = ({ userId, currentUrl, fallbackName, onUploaded }) => {
  const [url, setUrl] = useState<string | undefined | null>(currentUrl);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('Image must be under 5MB');
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
      const path = `${userId}/avatar.${ext}`;
      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?v=${Date.now()}`;

      // Persist to profile if column exists; ignore failures silently
      await supabase.from('profiles').update({ avatar: publicUrl }).eq('id', userId);

      setUrl(publicUrl);
      onUploaded?.(publicUrl);
      toast.success('Avatar updated');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={url || ''} alt="Profile avatar" />
        <AvatarFallback>
          {fallbackName ? fallbackName.slice(0, 2).toUpperCase() : <User className="h-10 w-10" />}
        </AvatarFallback>
      </Avatar>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
          {busy ? 'Uploading…' : 'Change avatar'}
        </Button>
        <p className="text-xs text-muted-foreground mt-1">PNG or JPG, up to 5MB</p>
      </div>
    </div>
  );
};

export default AvatarUpload;
