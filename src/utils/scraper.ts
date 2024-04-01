import axios from 'axios'
import { load } from 'cheerio'
import userAgent from 'random-useragent'
import { Genre, IGetNovels } from 'src/types'

class NovelScraper {
  private domain: string;
  private agent: string;

  constructor() {
    this.domain = process.env.API_URL ? process.env.API_URL : 'https://doctruyen.me';
    this.agent = userAgent.getRandom();
  }

  private async createRequest(path: string): Promise<any> {
    try {
      const url = `${this.domain}/${path}`.replace(
        /\?+/g,
        "?"
      );
      const { data } = await axios.request({
        method: "GET",
        url,
        headers: {
          "User-Agent": this.agent,
        },
      });
      return load(data);
    } catch (err) {
      throw err;
    }
  }

  private trim(text: string): string | undefined {
    return text?.replace(/\n/g, "").trim();
  }

  private getGenreId(link: string): string | undefined {
    if (!link) return "";
    return link.split('/').at(-1)
  }

  public async getGenres(): Promise<Genre[]> {
    try {
      const $ = await this.createRequest("");
      const genres = Array.from($(".list-cat .row a")).map((item) => {
        const id = this.getGenreId($(item).attr("href"));
        const name = this.trim($(item).attr("title"));
        const is_top = this.trim($(item).attr("class")).includes("top")
        const description = $(item).attr("title");
        return { id, name, is_top, description };
      });
      return [
        ...genres
      ];
    } catch (err) {
      throw err;
    }
  }

  private async getNovels(path: string, page = 1): Promise<IGetNovels> {
    try {
      const [$] = await Promise.all([
        this.createRequest(`${path + (path.includes("?") ? "&" : "?")}page=${page}`),
        // this.getGenres(),
      ]);

      const lastPage = Array.from($("ul.pagination li.page-item")).at(-2);
      const total_pages = $("a.page-link", lastPage).text() || 1;
      if (page > Number(total_pages)) {
        return {
          novels: [],
          total_pages: 0,
          current_page: 0
        };
      }

      const novels = Array.from($('.col-truyen-main .list-truyen .row')).map((item) => {
        const thumbnail = $("img.cover", item).attr("src");
        const a = $("h3.truyen-title a", item);
        const title = this.trim(a.text());
        const id = this.trim(a.attr("href").replace(`${this.domain}/`, ''));
        const is_new = this.trim($("span.label-title", item).attr("class")).includes('label-new');
        const is_full = this.trim($("span.label-title", item).attr("class")).includes('label-full');
        const author = this.trim($('span.author a', item).text()) || 'Đang cập nhật';
        const lastest_chapters = Array.from($('.col-chap', item)).map((chap) => {
          const id = this.trim($("a", chap).attr("href")).split('/').at(-1);
          const name = $("a", chap).attr("title");
          return {
            id,
            name,
          };
        })
        return Object.assign(
          {}, {
          id,
          thumbnail,
          title,
          is_new,
          is_full,
          description: '',
          short_description: '',
          lastest_chapters,
          genres: [],
          chapters: [],
          author
        })
      });
      return { novels, total_pages: Number(total_pages), current_page: page };
    } catch (err) {
      throw err;
    }
  }

  public async getNovelsByGenre(
    genreId: string,
    page = 1,
  ): Promise<any> {
    try {
      const path = genreId === "all" ? "the-loai/tat-ca?" : `the-loai/${genreId}?`;
      return await this.getNovels(path, page);
    } catch (err) {
      throw err;
    }
  }

}

const Scraper = new NovelScraper();

export { Scraper };