from fastapi import FastAPI
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np
# ... load df dari Supabase, bangun df['soup'] dengan kode Colab yang sama

vec = TfidfVectorizer(max_features=30000, ngram_range=(1, 2), min_df=3)
X = vec.fit_transform(df['soup'])           # sekali saat start

app = FastAPI()

@app.post('/recommend')
def recommend(body: dict):
    genres, tags, desc = body['genres'], body['tags'], body['description']
    q = (' '.join(map(clean_token, tags + genres)) + ' ') * 3 \
        + (' '.join(map(clean_token, genres)) + ' ') * 2 + clean_text(desc)
    sim = linear_kernel(vec.transform([q]), X).ravel()   # cosine (vektor sudah L2-normal)
    top = np.argsort(-sim)[:50]
    final = 0.7*sim[top] + 0.2*df.quality_score.values[top] + 0.1*df.popularity_score.values[top]
    order = top[np.argsort(-final)][:20]
    return [{**df.iloc[i][OUT_COLS].to_dict(), 'similarity': round(float(sim[i]), 3)} for i in order]