
// Example Pixel Shader

// uniform float exampleUniform;
uniform vec2 uResolution;
uniform float uTime;
#include "util"
ivec2 channel;

out vec4 fragColor;

vec4 sort(vec4 list, float v){
    bvec4 res = bvec4(step(v, list));
    return res.x ? vec4(v, list.xyz):
        res.y ? vec4(list.x, v, list.yz):
        res.z ? vec4(list.xy, v, list.z):
        res.w ? vec4(list.xyz, v):
        list;
}

vec4 fdist24(vec2 p) {
	vec2 n = floor(p + 0.5);
	vec4 dist4 = vec4(length(1.5 - abs(p - n)));
	for(float j = 0.0; j <= 4.0; j++) {
		vec2 glid;
		glid.y = n.y + sign(mod(j, 2.0) - 0.5) * ceil(j + 0.5);
		if(abs(glid.y - p.y) - 0.5 > dist4.w) {
			continue;
		}

		for(float i = -2.0; i <= 2.0; i++) {
			glid.x = n.x + i;
			vec2 jitter = hash22(glid) - 0.5;
			dist4 = sort(dist4, length(glid + jitter - p));
		}
	}
	return dist4;
}

vec4 fdist34(vec3 p){
	// pはマス目状の座標になっているので０．５足して床関数にすることで一番近い格子点を取得
    vec3 n = floor(p + 0.5);
	// abs(p - n) => 今見ている座標と格子点のベクトルを出して　1.5から減算しているのは「「
    vec4 dist4 = vec4(length(1.5 - abs(p - n)));
    for(float k = 0.0; k <= 4.0; k ++ ){
            vec3 glid;
            glid.z = n.z + sign(mod(k, 2.0) - 0.5) * ceil(k * 0.5);
            if (abs(glid.z - p.z) - 0.5 > dist4.w){
                continue;
            }
        for(float j = 0.0; j <= 4.0; j ++ ){
            glid.y = n.y + sign(mod(j, 2.0) - 0.5) * ceil(j * 0.5);
            if (abs(glid.y - p.y) - 0.5 > dist4.w){
                continue;
            }
            for(float i = -2.0; i <= 2.0; i ++ ){
                glid.x = n.x + i;
                vec3 jitter = hash33(glid) - 0.5;
                dist4 = sort(dist4, length(glid + jitter - p));
            }
        }
    }
	return dist4;
}

void main()
{
	vec2 pos = gl_FragCoord.xy * 2 / min(uResolution.x, uResolution.y);
	channel = ivec2(gl_FragCoord.xy * vec2(4,2) / uResolution.xy);
	pos *= 10;// pはマス目状の座標になっているので０．５足して床関数にすることで一番近い格子点を取得
	pos += uTime;
	// channelには2~4の値が入る
	fragColor =  channel.y == 0 ? vec4(fdist24(pos)[channel.x % 4]) : vec4(fdist34(vec3(pos, uTime))[channel.x % 4]);
	fragColor.a = 1.0;
}
