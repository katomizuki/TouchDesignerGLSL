uniform float uTime;
uniform vec2 uResolution;
#include "util"

out vec4 fragColor;

float sphereSDF(vec3 p, vec3 cent, float rad){
    return distance(p, cent) - rad;
}

float smin(float a, float b, float k){
	///  ここで二つの値の距離によっての補間の仕方を変えている
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	
return mix(b, a, h) - k * h * (1.0 - h); 
}

float sceneSDF(vec3 p){
    float[3] smallS, bigS;
    for(int i = 0; i < 3; i ++ ){
		// 3個ずつ小さいのと大きいのとを作成
        smallS[i] = sphereSDF(p, vec3(float(i - 1), sin(uTime), 0.0), 0.3);
		// 
        bigS[i] = sphereSDF(p, vec3(float(i - 1), 0.0, 0.0), 0.4);
    }
	// なめらかに補間させる
    float cap = smin(smallS[0], bigS[0], 0.1);
    float cup = smin(smallS[1], bigS[1], 0.3);
    float minus = smin(smallS[2], bigS[2], 0.5);
    return min(min(cap, cup), minus);
}

vec3 gradSDF(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p + vec3(-d, 0.0, 0.0)),
        sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p + vec3(0.0, - d, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p + vec3(0.0, 0.0, - d))
    ));
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 cPos = vec3(0, 0, 2);
	vec3 cDir = vec3(0, 0, -1);
	vec3 cUp = vec3(0, 1,0);
	vec3 cSide = cross(cDir, cUp);

	float targetDepth = 1.0;

	vec3 ray = pos.x * cSide + pos.y * cUp + targetDepth * cDir;
	vec3 rPos = ray + cPos;
	ray = normalize(ray);

	vec3 lDir = vec3(0,0, 1);

	fragColor = TDOutputSwizzle(vec4(vec3(0),1));

	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.01) {
			rPos += ray * sceneSDF(rPos);
		} else {
			float amb = 0.1;
			float diffuse = max(dot(lDir, gradSDF(rPos)), 0);
			vec3 color = vec3(1,1, 0);
			vec4 finalColor = vec4(color * (diffuse + amb), 1);
			fragColor = TDOutputSwizzle(finalColor);
		} 
	}
}
