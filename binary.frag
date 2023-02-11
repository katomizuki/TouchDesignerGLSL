uniform vec2 uResolution;
uniform float uTime;

out vec4 fragColor;
void main()
{
	vec2 pos = gl_FragCoord.xy * 2 / min(uResolution.x,uResolution.y);
	// 座標の正規化 & スケール
	uint[9] a = uint[] (
		uint(uTime), // 時間を符号なし整に変換
	    0xbu, // 16進数のＢを表している
        9u, // 16進数として９
        0xbu ^ 9u,// xor演算で排他的論理和
        0xffffffffu,// 
        0xffffffffu + uint(uTime), 
		floatBitsToUint(floor(uTime)), 
		floatBitsToUint(-floor(uTime)), 
		floatBitsToUint(11.5625));
		// 

		if (fract(pos.x) < 0.1) {
			if(floor(pos.x) == 1.0) {
				fragColor = TDOutputSwizzle( vec4(1,0,0,1) );
			} else if (floor(pos.x) == 9.0) {
				fragColor = TDOutputSwizzle( vec4(0,1,0,1) );
			} else {
				fragColor = TDOutputSwizzle( vec4(0.5) );
			}
		} else if (fract(pos.y) < 0.1) {
			fragColor = TDOutputSwizzle( vec4(0.5) );
		} else {
			uint b = a[int(pos.y)];
			b = (b << uint(pos.x)) >> 31;
			fragColor = TDOutputSwizzle(vec4(vec3(b), 1.0));
		}
}
