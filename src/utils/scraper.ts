import axios from 'axios'
import { load } from 'cheerio'
import userAgent from 'random-useragent'

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

  public async getGenres(): Promise<any> {
    try {
      const $ = await this.createRequest("");
      const genres = Array.from($(".list-cat .row a")).map((item) => {
        console.log('debug', item)
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

}

const Scraper = new NovelScraper();

export { Scraper };