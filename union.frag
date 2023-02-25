uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

float sphereSDF(vec3 p, vec3 c, float r) {
	return length(p - c) - r;
}

float sceneSDF(vec3 p) {
	float[3] smallS,bigS;
	for (int i = 0; i < 3; i++) {
		// 小さいのを三個作成
		smallS[i] = sphereSDF(p, vec3(float(i - 1), sin(uTime), 0.0), 0.3);
		// 大きいのを三個作成
		bigS[i] = sphereSDF(p, vec3(float(i - 1), 0.0, 0.0), 0.5);
	}

// 和集合
	float cap = max(smallS[0], bigS[0]);
	float cup = min(smallS[1], bigS[1]);
	float minus = max(-smallS[2], bigS[2]);
	return min(min(cap, cap), minus);
}

vec3 gradSDF(vec3 p){
    float d = 0.001;
    return normalize(vec3(
        sceneSDF(p + vec3(d, 0.0, 0.0)) - sceneSDF(p + vec3(-d, 0.0, 0.0)),
        sceneSDF(p + vec3(0.0, d, 0.0)) - sceneSDF(p + vec3(0.0, - d, 0.0)),
        sceneSDF(p + vec3(0.0, 0.0, d)) - sceneSDF(p + vec3(0.0, 0.0, - d))
    ));
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2 - uResolution.xy) / min(uResolution.x, uResolution.y);
	vec3 cPos = vec3(0.0, 0.0, 2.0);
	vec3 cUp = vec3(0.0, 1.0, 0.0);
	vec3 cDir = vec3(0.0 , 0.0, -1.0);
	vec3 cSide = cross(cDir, cUp);
	float targetDepth = 1.0;

	vec3 ray = pos.x * cSide + pos.y * cUp + targetDepth * cDir;

	vec3 lDir = normalize(vec3(0.0, 0.0, 1.0));

    vec3 rPos = ray + cPos;
	fragColor = TDOutputSwizzle(vec4(vec3(0), 1));
	for (int i = 0; i < 50; i++) {
		if (sceneSDF(rPos) > 0.001) {
			rPos += sceneSDF(rPos) * ray;
		} else {
			float amb = 0.1;
			float diffuse = 0.9 * max(dot(lDir, gradSDF(rPos)), 0);
			vec3 color = vec3(1, 0, 1);
			vec4 finalColor = vec4(color * (diffuse + amb),1);
			fragColor = TDOutputSwizzle(finalColor);
		}
	}
}
