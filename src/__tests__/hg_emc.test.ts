import { describe, it, expect } from 'vitest';
import { HgEmcContentPackSchema } from '../types/hg_emc';
import hgEmcPack from '../content/v1/hg_emc.json';

describe('Module Histoire-Géographie & EMC', () => {

  describe('Conformité des Contenus', () => {
    it('should validate the V1 HG-EMC Content Pack against Zod schema', () => {
      expect(() => HgEmcContentPackSchema.parse(hgEmcPack)).not.toThrow();
    });

    it('should ensure all documents have a valid license (no copyright infringement)', () => {
      const parsed = HgEmcContentPackSchema.parse(hgEmcPack);
      parsed.activities.forEach(act => {
        act.documents.forEach(doc => {
          expect(['original', 'public-domain']).toContain(doc.license);
        });
      });
    });

    it('should contain at least one activity of each mode (histoire, geographie, emc)', () => {
      const parsed = HgEmcContentPackSchema.parse(hgEmcPack);
      const modes = parsed.activities.map(a => a.mode);
      expect(modes).toContain('histoire');
      expect(modes).toContain('geographie');
      expect(modes).toContain('emc');
    });
  });

});
