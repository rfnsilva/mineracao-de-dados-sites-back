import { Router, Request, Response } from 'express';

import {
    login_get_imagens_perfil_facebook,
    login_get_manchetes_jornais_page_facebook,
    get_produtos_celulares_americanas_promocoes,
    login_get_images_perfil_instagram
} from './controllers/ImagensController';

import cors from 'cors'

const routes = Router();
routes.use(cors());

routes.get('/', (request: Request, response: Response) => {
    return response.json({ message: "PRONTO CARALHOOOOO !" })
});

//instagram
routes.post('/login_get_images_perfil_instagram', login_get_images_perfil_instagram); //feito
routes.post('/login_get_imagens_perfil_facebook', login_get_imagens_perfil_facebook); //feito
routes.post('/login_get_manchetes_jornais_page_facebook', login_get_manchetes_jornais_page_facebook); //feito
routes.post('/get_produtos_celulares_americanas_promocoes', get_produtos_celulares_americanas_promocoes); //feito


export default routes;