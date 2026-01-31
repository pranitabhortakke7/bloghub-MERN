import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';

export interface CartoonAvatar {
  id: string;
  gender: 'male' | 'female';
  emoji: string;
  color: string;
}

export const cartoonAvatars: CartoonAvatar[] = [
  // Male avatars
  { id: 'male-1', gender: 'male', emoji: '👨‍💼', color: '#6D9197' },
  { id: 'male-2', gender: 'male', emoji: '👨‍🎨', color: '#658B6F' },
  { id: 'male-3', gender: 'male', emoji: '👨‍🔬', color: '#2F575D' },
  { id: 'male-4', gender: 'male', emoji: '👨‍💻', color: '#99AEAD' },
  { id: 'male-5', gender: 'male', emoji: '👨‍🎓', color: '#C4CDC1' },
  { id: 'male-6', gender: 'male', emoji: '👨‍🚀', color: '#6D9197' },
  
  // Female avatars
  { id: 'female-1', gender: 'female', emoji: '👩‍💼', color: '#6D9197' },
  { id: 'female-2', gender: 'female', emoji: '👩‍🎨', color: '#658B6F' },
  { id: 'female-3', gender: 'female', emoji: '👩‍🔬', color: '#2F575D' },
  { id: 'female-4', gender: 'female', emoji: '👩‍💻', color: '#99AEAD' },
  { id: 'female-5', gender: 'female', emoji: '👩‍🎓', color: '#C4CDC1' },
  { id: 'female-6', gender: 'female', emoji: '👩‍🚀', color: '#6D9197' },
];

interface AvatarSelectorProps {
  selectedAvatarId: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarSelector({ selectedAvatarId, onSelect }: AvatarSelectorProps) {
  const [selectedGender, setSelectedGender] = React.useState<'all' | 'male' | 'female'>('all');

  const filteredAvatars = selectedGender === 'all' 
    ? cartoonAvatars 
    : cartoonAvatars.filter(a => a.gender === selectedGender);

  return (
    <div className="space-y-4">
      <div>
        <Label>Choose Your Avatar</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant={selectedGender === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('all')}
          >
            All
          </Button>
          <Button
            variant={selectedGender === 'male' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('male')}
          >
            Male
          </Button>
          <Button
            variant={selectedGender === 'female' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedGender('female')}
          >
            Female
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {filteredAvatars.map(avatar => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`
              aspect-square rounded-xl border-2 transition-all duration-200
              hover:scale-105 hover:shadow-lg
              ${selectedAvatarId === avatar.id 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-border hover:border-primary/50'
              }
            `}
            style={{ backgroundColor: avatar.color }}
          >
            <span className="text-4xl" role="img" aria-label={avatar.id}>
              {avatar.emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
