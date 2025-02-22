/**
 * @param $el
 * @param props
 * @param {[object]} props.articles
 * @constructor
 */
import {addSavedVideo} from '../store/videoStore.js';

export function SearchModalArticles($el, props) {

    const bindEvents = () => {
        $el.addEventListener('click', ({target: {dataset: {click, videoId}}}) => {
            if (click === 'saveVideo') {
                saveVideo(videoId);
            }
        });
    };

    const saveVideo = (videoId) => {
        addSavedVideo(videoId);
    };

    const articleNotFoundTemplate = `
        <div class="stretch d-flex flex-col items-center">
            <img src="../../src/images/status/not_found.png" width="100px" alt="not found">
            <h2>검색결과가 없습니다.</h2>
            <div>다른 검색어를 시도해 보거나 검색 필터를 삭제하세요.</div>
        </div>
    `;

    const articleSkeletonTemplate = Array(8)
        .fill(null)
        .map(_ => `
            <article class="clip skeleton">
                <div class="preview-container image">
                    <div></div>
                </div>
                <div class="content-container pt-2">
                    <div>
                        <div class="meta line">
                            <p></p>
                        </div>
                        <div class="d-flex justify-end line mt-3"></div>
                    </div>
                </div>
            </article>
        `)
        .join('');

    const articleNormalTemplate = ({videoId, title, channelId, channelTitle, publishedAt}) => `
        <article class="clip">
            <div class="preview-container">
                <iframe
                    width="100%"
                    height="118"
                    src="https://www.youtube.com/embed/${videoId}"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <div class="content-container pt-2 px-1">
                <h3>${title}</h3>
                <div>
                    <a
                        href="https://www.youtube.com/channel/${channelId}"
                        target="_blank"
                        class="channel-name mt-1"
                    >
                        ${channelTitle} 
                    </a>
                    <div class="meta">
                        <p>${publishedAt}</p>
                    </div>
                    <div class="d-flex justify-end">
                        <button class="btn" data-click="saveVideo" data-video-id="${videoId}">⬇️ 저장</button>
                    </div>
                </div>
            </div>
        </article>
    `;

    const computeArticlesTemplate = ({articles}) => {
        if (!articles) {
            return articleSkeletonTemplate;
        }

        if (articles.length === 0) {
            return articleNotFoundTemplate;
        }

        return articles.map(({
                                 videoId,
                                 channelId,
                                 channelTitle,
                                 title,
                                 publishedAt,
                             }) => articleNormalTemplate({videoId, title, channelId, channelTitle, publishedAt}))
                       .join('');
    };

    const render = () => {
        const {articles} = props;
        const articlesTemplate = computeArticlesTemplate({articles});

        $el.innerHTML = `
            <section class="video-wrapper">
                ${articlesTemplate}                    
            </section>
        `;
    };

    render();
    bindEvents();
}
