import { SYSTEM_LANGUAGES_LIST } from '../app/config/consts.js';

const localizeDocsData = (lang, docs) => {
    if (!docs && !docs.length) return [];
    return docs.map((el) => {
        const newOne = {
            ...el,
            name: el[lang]?.name || el.name,
            content: el[lang]?.content || el.content,
            files: el.files?.map((file) => {
                    return {
                        ...file,
                        name: file[lang]?.name || file.name,         // original filename
                        title: file[lang] || file.title,      // name to store in db
                    };
                },
            ),
        };

        if (el.title) {
            newOne.title = el[lang]?.name || el.title;
        }

        SYSTEM_LANGUAGES_LIST.forEach((lng) => {
            delete newOne[lng];
            newOne.files.forEach(file => {
                delete file[lng];
            });
        });

        delete newOne.perm;
        return newOne;
    });
};

export const reduceDocs = (docs, lean = false) => {
    return docs.map(el => {
        const newDoc = lean ? { ...el } : { ...el._doc };
        delete newDoc.perm;
        return newDoc;
    });
};

export const responseDocList = (req, res, err, docs) => {
    if (err) {
        res.status(500).json(err);
        return;
    }
    console.log('req.query.lang', req.query.lang);

    if (req.query.lang) {
        const localizesDocs = localizeDocsData(req.query.lang || SYSTEM_LANGUAGES_LIST[0], docs);
        res.status(200).json(localizesDocs);
    } else {
        res.status(200).json(reduceDocs([...docs], true));
    }
};
