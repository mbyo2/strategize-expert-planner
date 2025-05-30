
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Eye, Ear, Type, MousePointer, Keyboard } from 'lucide-react';

const A11yMenu: React.FC = () => {
  const [fontSize, setFontSize] = useState([16]);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [colorScheme, setColorScheme] = useState('default');

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    document.documentElement.style.setProperty('--font-size-base', `${value[0]}px`);
  };

  const handleHighContrastToggle = (checked: boolean) => {
    setHighContrast(checked);
    if (checked) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  const handleReducedMotionToggle = (checked: boolean) => {
    setReducedMotion(checked);
    if (checked) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
        <CardDescription>
          Customize the interface for your accessibility needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual Settings
            </h4>
            
            <div className="space-y-2">
              <Label>Font Size: {fontSize[0]}px</Label>
              <Slider
                value={fontSize}
                onValueChange={handleFontSizeChange}
                max={24}
                min={12}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast">High Contrast Mode</Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={handleHighContrastToggle}
              />
            </div>

            <div className="space-y-2">
              <Label>Color Scheme</Label>
              <Select value={colorScheme} onValueChange={setColorScheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                  <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                  <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Interaction Settings
            </h4>

            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion">Reduce Motion</Label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={handleReducedMotionToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="keyboard-nav">Keyboard Navigation</Label>
              <Switch
                id="keyboard-nav"
                checked={keyboardNav}
                onCheckedChange={setKeyboardNav}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader">Screen Reader Support</Label>
              <Switch
                id="screen-reader"
                checked={screenReader}
                onCheckedChange={setScreenReader}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm">
              Reset All
            </Button>
            <Button variant="outline" size="sm">
              Save Profile
            </Button>
            <Button variant="outline" size="sm">
              Load Profile
            </Button>
            <Button variant="outline" size="sm">
              Export Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default A11yMenu;
