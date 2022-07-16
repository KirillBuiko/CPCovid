import pickle
import pandas as pd
import uvicorn
from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File
from fastapi import Request
from fastapi import Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from io import StringIO
from fastapi.middleware.cors import CORSMiddleware
from csv_conf import CsvConf
csv_confs = [
    CsvConf(';', ','),
    CsvConf(',', '.')
]

rf = pickle.load(open('inf_rate_model_has_metro_pickaim.pickaim', 'rb'))
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8087",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_csv(data: StringIO, encoding) -> pd.DataFrame:
    result = None
    for conf in csv_confs:
        try:
            result = pd.read_csv(StringIO(data.getvalue()), sep=conf.separator,
                                 decimal=conf.decimal, encoding=encoding)
            if 'lat' in result:
                break
        except Exception as e:
            print(f'Exception: {e}')
    if result is not None:
        return result
    else:
        raise Exception('Can not read file')


def predict(model, file: StringIO, encoding='utf-8'):
    train = read_csv(file, encoding)
    train = train.fillna(0)
    columns_to_drop = ['name', 'district', 'region_x',
                       'subject', 'Unnamed: 0', 'inf_rate']
    for column in columns_to_drop:
        train.drop(column, inplace=True, axis=1)
    result = model.predict(train)
    return list(result)


def generate(url, type):
    file = ''
    with open(url, encoding="utf-8") as f:
        file = f.read()
    return Response(content=file, status_code=200, media_type=type)

@app.get('/css/{css_file}', response_class=Response)
async def send_css(css_file):
    return generate('site/css/' + css_file, 'text/css')

@app.get('/js/{js_file}', response_class=Response)
async def send_js(js_file):
    return generate('site/js/' + js_file, 'application/javascript')

@app.get('/js/leaflet/{js_file}', response_class=Response)
async def send_js(js_file):
    return generate('site/js/leaflet/' + js_file, 'application/javascript')

@app.post('/upload')
async def upload_data_csv(file: UploadFile = File(...)):
    data = StringIO(str(file.file.read(), encoding='utf-8'))
    return predict(rf, data)

@app.get('/', response_class=Response)
async def send_page():
    return generate('site/index.html', 'text/html')

@app.get('/result', response_class=Response)
async def send_page():
    return generate('site/result.html', 'text/html')

if __name__ == '__main__':
    uvicorn.run(app, port=8099)
