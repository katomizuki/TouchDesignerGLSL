out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;

ivec2 channel;

const uint UINT_MAX = 0xffffffffu;

uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);

uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}

uvec3 uhash33(uvec3 n){
    n ^= (n.yzx << u);
    n ^= (n.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}

vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}

vec3 hash33(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return vec3(uhash33(n)) / vec3(UINT_MAX);
}

float hash21(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x) / float(UINT_MAX);
}

float hash31(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x) / float(UINT_MAX);
}

void main()
{
	float time = floor(uTime * 60);
	vec2 pos = gl_FragCoord.xy + time;
	channel = ivec2(gl_FragCoord.xy * 2 / uResolution.xy);
	if (channel[0] == 0) {
		if(channel[1] == 0) {
			fragColor = TDOutputSwizzle(vec4(vec3(hash21(pos)), 1));
		} else {
			fragColor = TDOutputSwizzle(vec4(vec3(hash22(pos),1),1));
		}
	} else {
		if (channel[1] == 0) {
			fragColor = TDOutputSwizzle(vec4(vec3(hash31(vec3(pos, time))),1));
		} else {
			fragColor = TDOutputSwizzle(vec4(vec3(hash33(vec3(pos, time))),1));
		}
	}
}
