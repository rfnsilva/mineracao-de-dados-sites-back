import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import  puppeteer from 'puppeteer-core';

//loga em seu perfil do instagram
export const login_get_images_perfil_instagram = async(req: Request, res: Response) => {
  try {
    const { perfil } = req.body;

    const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`https://www.instagram.com/accounts/login/`);
    
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', process.env.EMAIL_USER);

    await page.type('input[name="password"]', process.env.PASS_USER);
    
    const linkHandlers = await page.$x(`//*[@id="loginForm"]/div/div[3]/button`);
    await linkHandlers[0].click();

    await page.waitFor(3000);
    const linkHandlers_next = await page.$x(`//*[@id="react-root"]/section/main/div/div/div/div/button`);
    await linkHandlers_next[0].click();

    await page.waitFor(3000);

    /*const linkHandlers_next_next = await page.$x(`/html/body/div[4]/div/div/div/div[3]/button[2]`);
    await linkHandlers_next_next[0].click();*/

    const search_perfil = `https://www.instagram.com/${perfil}/?hl=pt-br`;
    await page.goto(search_perfil);
    
    const list_imagens = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('section > main > div > div._2z6nI > article img');
      const array = [...nodeList];
      
      const list = array.map(item => {
          return item.getAttribute('src');
      })

      return list;
    })
    await browser.close();
    
    return res.json(list_imagens);
  } catch (error) {
      return res.status(404).json({ message: 'erro ao pegar imagens do instagram' })
  }
}

//retorna imagens perfil facebook
export const login_get_imagens_perfil_facebook = async(req: Request, res: Response) => {
  try {
    const { perfil } = req.body;

    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`https://facebook.com/?ref=tn_tnmn`);

    // Login
    await page.waitForSelector('#email');
    await page.type('#email', process.env.EMAIL_USER);
    await page.type('#pass', process.env.PASS_USER);
    await page.click('#u_0_b');
    await page.waitForNavigation();

    const search_perfil = `https://facebook.com/${perfil}/photos`;
    await page.goto(search_perfil);

    await page.waitFor(3000);
    const linkHandlers_next = await page.$x(`/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div/div/div[3]/div/div/div/div[1]/div/div/div[1]/div/div/div/div[1]/a[4]`);
    await linkHandlers_next[0].click();

    const list = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div.i1fnvgqd.lhclo0ds.j83agx80.ll8tlv6m img');
      const array = [...nodeList];
      
      const list = array.map(item => {
          return item.getAttribute('src');
      })
      return list;
    })
    await browser.close();
    
    return res.json(list);
  } catch (error) {
      return res.status(404).json({ message: 'erro ao pegar imagens do facebook' })
  }
}

//retorna manchetes das postagem de jornais no facebbok
export const login_get_manchetes_jornais_page_facebook = async(req: Request, res: Response) => {
  try {
    const { url } = req.body;

    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`https://facebook.com/?ref=tn_tnmn`);
    
    // Login
    await page.waitForSelector('#email');
    await page.type('#email', process.env.EMAIL_USER);
    await page.type('#pass', process.env.PASS_USER);
    await page.click('#u_0_b');
    await page.waitForNavigation();

    const search_perfil = `https://facebook.com/${url}`;
    await page.goto(search_perfil);

    await page.waitFor(5000);

    const list = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('div.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql.ii04i59q div');
      const array = [...nodeList];
      
      const list = array.map(item => {
          return item.innerHTML;
      })
    
      return list;
    })
    await browser.close();
    
    return res.json(list);
  } catch (error) {
      return res.status(404).json({ message: 'erro ao pegar imagens do facebook' })
  }
}

//retorna imagens dos produtos(celulares) americanas em promoção
let retorno_final: any[] = [];
export const get_produtos_celulares_americanas_promocoes = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`${url}`);
    
    let resumo: any;
    for (let i = 0; i < 2; i++) {
      resumo = await page.evaluate(() => {
        const nodeListSPAN = document.querySelectorAll('section > div.Info-bwhjk3-5.gWiKbT.ViewUI-sc-1ijittn-6.iXIDWU > div:nth-child(2) > div.PriceWrapper-bwhjk3-13.IjiIU.ViewUI-sc-1ijittn-6.iXIDWU > span')
        
        const arraySPAN = [...nodeListSPAN];
      
        const listSPAN = arraySPAN.map(item => {
          return item.innerHTML;
        })
        const resumo = listSPAN

        return resumo;
      })
      retorno_final[i] = resumo;
      
      const linkHandlers = await page.$x(`//*[@id="content-middle"]/div[6]/div/div/div/div[2]/div/ul/li[10]/a`);
      await linkHandlers[0].click();
      await page.waitFor(6000);
    }
    await browser.close();
    
    return res.json(retorno_final);
  } catch (error) {
      return res.status(404).json({ message: 'erro ao pegar celulares americanas promoçao' })
  }
}
