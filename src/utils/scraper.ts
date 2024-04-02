import axios from 'axios'
import { load } from 'cheerio'
import userAgent from 'random-useragent'
import { Chapter, Genre, IChapterContent, IGetNovels, Novel } from 'src/types'

class NovelScraper {
	private domain: string;
	private agent: string;

	constructor() {
		this.domain = process.env.API_URL
			? process.env.API_URL
			: 'https://doctruyen.me';
		this.agent = userAgent.getRandom();
	}

	private async createRequest(path: string): Promise<any> {
		try {
			const url = `${this.domain}/${path}`.replace(/\?+/g, '?');
			const { data } = await axios.request({
				method: 'GET',
				url,
				headers: {
					'User-Agent': this.agent,
				},
			});
			return load(data);
		} catch (err) {
			throw err;
		}
	}

	private async createJsonRequest(path: string): Promise<any> {
		try {
			const url = `${this.domain}/${path}`.replace(/\?+/g, '?');
			const { data } = await axios.request({
				method: 'GET',
				url,
				headers: {
					'User-Agent': this.agent,
				},
			});
			return load(data.data);
		} catch (err) {
			throw err;
		}
	}

	private trim(text: string): string | undefined {
		return text?.replace(/\n/g, '').trim();
	}

	private getGenreId(link: string): string | undefined {
		if (!link) return '';
		return link.split('/').at(-1);
	}

	public async getGenres(): Promise<Genre[]> {
		try {
			const $ = await this.createRequest('');
			const genres = Array.from($('.list-cat .row a')).map((item) => {
				const id = this.getGenreId($(item).attr('href'));
				const name = this.trim($(item).attr('title'));
				const is_top = this.trim($(item).attr('class')).includes('top');
				const description = $(item).attr('title');
				return { id, name, is_top, description };
			});
			return [...genres];
		} catch (err) {
			throw err;
		}
	}

	private async getNovels(path: string, page = 1): Promise<IGetNovels> {
		try {
			const [$] = await Promise.all([
				this.createRequest(
					`${path + (path.includes('?') ? '&' : '?')}page=${page}`,
				),
				// this.getGenres(),
			]);

			const lastPage = Array.from($('ul.pagination li.page-item')).at(-2);
			const total_pages = $('a.page-link', lastPage).text() || 1;
			if (page > Number(total_pages)) {
				return {
					novels: [],
					total_pages: 0,
					current_page: 0,
				};
			}

			const novels = Array.from($('.col-truyen-main .list-truyen .row')).map(
				(item) => {
					const thumbnail = $('img.cover', item).attr('src');
					const a = $('h3.truyen-title a', item);
					const title = this.trim(a.text());
					const id = this.trim(a.attr('href').replace(`${this.domain}/`, ''));
					const label_title = $('span.label-title', item).attr('class');
					const is_new = label_title
						? label_title.includes('label-new')
						: false;
					const is_full = label_title
						? label_title.includes('label-full')
						: false;
					const authorA = this.trim($('span.author a', item).attr('href'));
					const author = {
						id: authorA ? authorA.split('/').at(-1) : '',
						name: this.trim($('span.author a', item).text()) || 'Đang cập nhật',
					};
					const lastest_chapters = Array.from($('.col-chap', item)).map(
						(chap) => {
							const id = this.trim($('a', chap).attr('href')).split('/').at(-1);
							const name = $('a', chap).attr('title');
							return {
								id,
								name,
							};
						},
					);
					return Object.assign(
						{},
						{
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
							author,
						},
					);
				},
			);
			return { novels, total_pages: Number(total_pages), current_page: page };
		} catch (err) {
			throw err;
		}
	}

	public async getNovelsByGenre(
		genreId: string,
		page = 1,
	): Promise<IGetNovels> {
		try {
			const path =
				genreId === 'all' ? 'the-loai/tat-ca?' : `the-loai/${genreId}?`;
			return await this.getNovels(path, page);
		} catch (err) {
			throw err;
		}
	}

	public async getNewNovels(gid?: string, page = 1): Promise<IGetNovels> {
		try {
			const path = `the-loai/${gid ? gid : 'tat-ca'}/truyen-moi?`;
			return await this.getNovels(path, page);
		} catch (err) {
			throw err;
		}
	}

	public async getHotNovels(gid?: string, page = 1): Promise<IGetNovels> {
		try {
			const path = `the-loai/${gid ? gid : 'tat-ca'}/truyen-hot?`;
			return await this.getNovels(path, page);
		} catch (err) {
			throw err;
		}
	}

	public async getFullNovels(gid?: string, page = 1): Promise<IGetNovels> {
		try {
			const path = `the-loai/${gid ? gid : 'tat-ca'}/truyen-full?`;
			return await this.getNovels(path, page);
		} catch (err) {
			throw err;
		}
	}

	public async getNovelsOfAuthor(aid: string): Promise<IGetNovels> {
		try {
			const path = `tac-gia/${aid}?`;
			return await this.getNovels(path);
		} catch (err) {
			throw err;
		}
	}

	public async getChapters(nid: string): Promise<Chapter[]> {
		try {
			const $ = await this.createJsonRequest(`chapter-list?comic_slug=${nid}`);
			const chapters = Array.from($('option')).map((item) => {
				const id = this.trim($(item).attr('value'));
				const name = this.trim($(item).text());
				return { id, name };
			});
			return chapters || [];
		} catch (err) {
			throw err;
		}
	}

	public async getNovelDetail(nid: string): Promise<Novel> {
		try {
			const [$, chapters] = await Promise.all([
				this.createRequest(nid),
				this.getChapters(nid),
			]);

			const title = this.trim($('#comic_name').text());
			const thumbnail = $('.info-holder img').attr('src');
			const authorA = this.trim(
				$('.info-holder a[itemprop=author]').attr('href'),
			);
			const author = {
				id: authorA ? authorA.split('/').at(-1) : '',
				name:
					this.trim($('.info-holder a[itemprop=author]').text()) ||
					'Đang cập nhật',
			};
			const genres = Array.from($('.info-holder a[itemprop=genre]')).map(
				(item) => ({
					id: this.trim($(item).attr('href')).split('/').at(-1),
					name: this.trim($(item).attr('title')),
				}),
			);
			const description = Array.from($('.desc section.limit-desc p'))
				.slice(0, -1)
				.map((item) => `<p>${$(item).prop('innerHTML')}</p>`)
				.join();
			const lastest_chapters = Array.from($('ul.l-chapters li a')).map(
				(item) => ({
					id: this.trim($(item).attr('href')).split('/').at(-1),
					name: this.trim($(item).attr('title')),
				}),
			);

			return {
				id: nid,
				title,
				thumbnail,
				author,
				genres,
				description: description,
				lastest_chapters,
				chapters,
			};
		} catch (err) {
			throw err;
		}
	}

	public async getChapterContent(
		nid: string,
		cid: string,
	): Promise<IChapterContent> {
		try {
			const $ = await this.createRequest(`${nid}/${cid}`);
			const content = $('#chapter-content');
			$('div', content).remove();
			return {
				content: this.trim($(content).prop('innerHTML')).replace('\n', ''),
			};
		} catch (err) {
			throw err;
		}
	}
}

const Scraper = new NovelScraper();

export { Scraper };
