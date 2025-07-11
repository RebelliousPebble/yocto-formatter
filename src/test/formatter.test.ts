import * as assert from 'assert';
import { BitBakeFormatter } from '../formatter';

describe('BitBakeFormatter', () => {
    let formatter: BitBakeFormatter;
    
    beforeEach(() => {
        formatter = new BitBakeFormatter();
    });

    it('should format variable assignments correctly', () => {
        const input = `DESCRIPTION="Example recipe"
HOMEPAGE   =    "https://example.com"
LICENSE="MIT"`;
        
        const result = (formatter as any).formatBitBakeText(input);
        
        assert.ok(result.includes('DESCRIPTION = "Example recipe"'));
        assert.ok(result.includes('HOMEPAGE = "https://example.com"'));
        assert.ok(result.includes('LICENSE = "MIT"'));
    });

    it('should format function definitions correctly', () => {
        const input = `do_configure(){
./configure \${EXTRA_OECONF}
}`;
        
        const result = (formatter as any).formatBitBakeText(input);
        
        assert.ok(result.includes('do_configure() {'));
        assert.ok(result.includes('    ./configure ${EXTRA_OECONF}'));
        assert.ok(result.includes('}'));
    });

    it('should preserve comments', () => {
        const input = `# This is a comment
DESCRIPTION = "Example recipe"
# Another comment`;
        
        const result = (formatter as any).formatBitBakeText(input);
        
        assert.ok(result.includes('# This is a comment'));
        assert.ok(result.includes('# Another comment'));
    });

    it('should handle addtask statements', () => {
        const input = `addtask custom_task after do_compile before do_install`;
        
        const result = (formatter as any).formatBitBakeText(input);
        
        assert.ok(result.includes('addtask custom_task after do_compile before do_install'));
    });
});