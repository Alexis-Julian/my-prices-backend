// import puppeteer from 'puppeteer';
import { chromium } from 'playwright';

export async function ScrapingPuppeteer(URL: string, FunctionScrapping) {
  const browser = await chromium.launch();

  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: 'networkidle',
  });

  const result = await page.evaluate(FunctionScrapping);

  await browser.close();

  return result;
}
export async function GET_PRODUCT_JUMBO(name: string) {
  const URL = `https://www.jumbo.com.ar/${name}?_q=${name}&map=ft`;
  function searchProductJUMBO() {
    const productsList: any = document.querySelector(
      '#gallery-layout-container',
    );

    const products = productsList.querySelectorAll('section');

    const ArrayProducts = Array.from(products);

    ArrayProducts.map((product: any) => {
      const img = product.querySelector(
        '.vtex-product-summary-2-x-imageNormal',
      ).src;
      const price = product.querySelector('.vtex-flex-layout-0-x-flexCol');

      console.log(price);
      const description = product.querySelector(
        '.vtex-product-summary-2-x-productBrand',
      ).innerHTML;
      return { price, description, img };
    });
  }

  const result = await ScrapingPuppeteer(URL, searchProductJUMBO);
  console.log(result);
  return result;
}
// GET_PRODUCT_JUMBO('leche');

export async function GET_PRODUCT_COTO(name: string) {
  const URL = `https://www.cotodigital3.com.ar/sitios/cdigi/browse?_dyncharset=utf-8&Dy=1&Ntt=${name}&Nty=1&Ntk=&siteScope=ok&_D%3AsiteScope=+&atg_store_searchInput=${name}&idSucursal=200&_D%3AidSucursal=+&search=Ir&_D%3Asearch=+&_DARGS=%2Fsitios%2Fcartridges%2FSearchBox%2FSearchBox.jsp`;

  function SearchProductCoto() {
    function SearchDisocunt(e: any) {
      let discounts;
      /* Obtencion de los descuentos */
      const discountPrice: any = e
        .querySelector('.product_discount')
        ?.querySelectorAll(
          '.first_price_discount_container, .second_price_discount_container',
        );

      if (discountPrice) {
        const discountArray = Array.from(discountPrice);
        discounts = discountArray.map((e: any) => {
          const dicount_amount = e.querySelector(
            '.text_price_discount',
          )?.innerHTML; // Porcentaje de descuento
          // let discount_img = e.querySelector("img")?.src; //Imagen de la tarjeta
          let discount_price = e.querySelector('.price_discount')?.innerHTML; // Precio
          discount_price = String(discount_price).split('<')[0]; // Obtenemos solamente el precio
          return { dicount_amount, discount_price };
        });
      }
      return discounts;
    }

    const products_UL: HTMLElement | any = document.querySelector('#products');
    // console.log(quotes);
    const products_LI: HTMLElement[] = products_UL.querySelectorAll('li');

    const productsArray = Array.from(products_LI);

    const data = [...productsArray].map((e) => {
      let storePrice;
      /* Descripcion del producto y si no hay descripcion, el producto se cancela */
      const description = e.querySelector('.descrip_full')?.innerHTML;
      // console.log(description);
      if (!description) return undefined;

      /* Esta parte en proceso */
      const cashPrice = e.querySelector('.price_regular')?.innerHTML; //Precio Regular
      const regularPrice = e.querySelector('.price_regular_precio')?.innerHTML; //Precio Contado

      /* Si no hay precio regular y tampoco precio contado se verifica si hay precio neto  */
      if (!cashPrice && !regularPrice) {
        storePrice = e.querySelector('.atg_store_newPrice')?.innerHTML; //Precio Neto
        storePrice =
          '$' + String(storePrice).split('$')[1].split('\n')[0].split(',')[0]; //Modificar esto por que es un quilombo
      }

      /* Funcion para buscar decuentos del producto */
      const discounts = SearchDisocunt(e);

      /*Por ultimo se busca la imagen del product  */
      const img = e
        .querySelector('.atg_store_productImage')
        ?.querySelector('img')?.src;

      return {
        img,
        description,
        cashPrice,
        regularPrice,
        storePrice,
        discounts,
      };
    });

    return data;
  }

  const data = await ScrapingPuppeteer(URL, SearchProductCoto);
  return data;
}

export async function GET_PRODUCT_CARREFOUR(name: string) {
  const URL = `https://www.carrefour.com.ar/${name}?_q=${name}&map=ft`;

  function SearchProductCarrefour() {
    function AplanarPrecio(elementHTML) {
      let precio: string;

      elementHTML.map((e) => {
        precio += e.innerHTML;
      });

      precio = String(precio).split(';')[1];

      return precio;
    }

    const ArticlesProducts = document.querySelectorAll(
      '.valtech-carrefourar-search-result-0-x-galleryItem',
    );

    const ListaProductos = Array.from(ArticlesProducts);

    const data = ListaProductos.map((producto) => {
      let productoObject = {};
      let precio: string;

      try {
        const descripcion = producto.querySelector(
          '.vtex-product-summary-2-x-productBrand',
        ).innerHTML;
        productoObject = { descripcion };

        const imagen = producto.querySelector('img').src;
        productoObject = { ...productoObject, imagen };

        const precioLista = producto.querySelector(
          '.valtech-carrefourar-product-price-0-x-listPrice',
        );

        if (precioLista) {
          const ContenedorPrecio = producto.querySelector(
            '.valtech-carrefourar-product-price-0-x-sellingPriceValue',
          );

          const porcentaje = ContenedorPrecio.querySelector(
            '.valtech-carrefourar-product-price-0-x-discountPercentage ',
          ).innerHTML;

          const precioOferta = ContenedorPrecio.querySelector(
            '.valtech-carrefourar-product-price-0-x-currencyContainer',
          );
          precio = AplanarPrecio(Array.from(precioOferta.children));

          productoObject = { ...productoObject, precio, porcentaje };
        } else {
          const precioSinOferta = producto.querySelector(
            '.valtech-carrefourar-product-price-0-x-currencyContainer',
          );
          precio = AplanarPrecio(Array.from(precioSinOferta.children));

          productoObject = { ...productoObject, precio };
        }

        return productoObject;
      } catch (e) {
        return {
          message: e.message,
          data: null,
        };
      }
    });

    return data;
  }

  const data = await ScrapingPuppeteer(URL, SearchProductCarrefour);

  return data;
}

// GET_PRODUCT_CARREFOUR('sprite');
