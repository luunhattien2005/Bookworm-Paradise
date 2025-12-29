const Book = require('../models/Book');
const Author = require('../models/Author');
const Tag = require('../models/Tag');

// HÀM PHỤ TRỢ TÌM AUTHOR VÀ TAG
async function findOrCreateAuthor(name) {
    if (!name) return null;
    let author = await Author.findOne({ AuthorName: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (!author) {
        author = await Author.create({ AuthorName: name });
    }
    return author._id;
}

async function findOrCreateTags(categoryString) {
    if (!categoryString) return [];
    const tagNames = categoryString.split(',').map(t => t.trim()).filter(t => t);
    const tagIds = [];
    for (const tagName of tagNames) {
        let tag = await Tag.findOne({ name: { $regex: new RegExp(`^${tagName}$`, 'i') } });
        if (!tag) {
            tag = await Tag.create({ name: tagName });
        }
        tagIds.push(tag._id);
    }
    return tagIds;
}

const bookController = {
    searchBooks: async (req, res) => {
        try {
            const { q, tag, author, min, max, page = 1, limit = 20 } = req.query;
            const filter = { isDeleted: false };
            if (q) filter.name = { $regex: q, $options: 'i' };
            if (tag) filter.tags = { $all: tag.split(',') };
            if (author) filter.author = { $in: author.split(',') };
            if (min || max) {
                filter.price = {};
                if (min) filter.price.$gte = Number(min);
                if (max) filter.price.$lte = Number(max);
            }
            const books = await Book.find(filter)
                .populate('author', 'AuthorName').populate('tags', 'name')
                .sort({ createdAt: -1 })
                .limit(Number(limit)).skip((page - 1) * limit);
            res.json(books);
        } catch (err) { res.status(500).json({ message: err.message }); }
    },
    getBookBySlug: async (req, res) => {
        try {
            const book = await Book.findOne({ slug: req.params.slug, isDeleted: false }).populate('author').populate('tags');
            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.json(book);
        } catch (err) { res.status(500).json({ message: err.message }); }
    },
    getBookById: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id).populate('author').populate('tags');
            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.json(book);
        } catch (err) { res.status(500).json({ message: err.message }); }
    },

    createBook: async (req, res) => {
        try {
            const { 
                name, price, stockQuantity, description, author, category, imgURL, 
                publisher, provider, translator, publicationYear, weight, size, page, type 
            } = req.body;

            const authorId = await findOrCreateAuthor(author);
            const tagIds = await findOrCreateTags(category);

            const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") + "-" + Date.now();

            const newBook = new Book({
                name, slug, description,
                price: Number(price),
                stockQuantity: Number(stockQuantity),
                author: authorId,
                tags: tagIds,
                imgURL: imgURL || "https://dummyimage.com/600x400/000/fff",
                
                // Các trường mới thêm vào Database
                publisher: publisher || "N/A",
                provider: provider || "N/A",
                translator: translator || "N/A",
                publicationYear: Number(publicationYear) || new Date().getFullYear(),
                weight: Number(weight) || 0,
                size: size || "N/A",
                page: Number(page) || 0,
                type: type || "Bìa mềm"
            });

            await newBook.save();
            res.status(201).json({ message: "Thêm sách thành công!", book: newBook });
        } catch (err) {
            res.status(400).json({ message: "Lỗi: " + err.message });
        }
    },

    updateBook: async (req, res) => {
        try {
            const { 
                name, price, stockQuantity, description, author, category, imgURL,
                publisher, provider, translator, publicationYear, weight, size, page, type 
            } = req.body;
            
            const updateData = {};
            // Basic fields
            if (name) updateData.name = name;
            if (price) updateData.price = Number(price);
            if (stockQuantity) updateData.stockQuantity = Number(stockQuantity);
            if (description) updateData.description = description;
            if (imgURL) updateData.imgURL = imgURL;

            // Relation fields
            if (author) updateData.author = await findOrCreateAuthor(author);
            if (category) updateData.tags = await findOrCreateTags(category);

            // New fields (cập nhật nếu có gửi lên)
            if (publisher) updateData.publisher = publisher;
            if (provider) updateData.provider = provider;
            if (translator) updateData.translator = translator;
            if (publicationYear) updateData.publicationYear = Number(publicationYear);
            if (weight) updateData.weight = Number(weight);
            if (size) updateData.size = size;
            if (page) updateData.page = Number(page);
            if (type) updateData.type = type;

            const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách" });

            res.json({ message: "Cập nhật thành công", book: updatedBook });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // hàm Delete, Get others
    deleteBook: async (req, res) => {
        try { await Book.findByIdAndUpdate(req.params.id, { isDeleted: true }); res.json({ message: "Đã xóa" }); } 
        catch (err) { res.status(500).json({ message: err.message }); }
    },
    getAllAuthors: async (req, res) => { try { res.json(await Author.find()); } catch (err) { res.status(500).json({ message: err.message }); } },
    createAuthor: async (req, res) => { try { res.status(201).json(await Author.create(req.body)); } catch (err) { res.status(400).json({ message: err.message }); } },
    getAllTags: async (req, res) => { try { res.json(await Tag.find()); } catch (err) { res.status(500).json({ message: err.message }); } },
    createTag: async (req, res) => { try { res.status(201).json(await Tag.create(req.body)); } catch (err) { res.status(400).json({ message: err.message }); } },
    getTopRatedBooks: async (req, res) => { const books = await Book.find({ isDeleted: false }).sort({ averageRating: -1 }).limit(3); res.json(books); },
    getBestSellerBooks: async (req, res) => { const books = await Book.find({ isDeleted: false }).sort({ soldQuantity: -1 }).limit(3); res.json(books); },
    getBooksByTagName: async (req, res) => {
        const tagName = req.query.tag || "Mùa Hè";
        const tagObj = await Tag.findOne({ name: tagName });
        if (!tagObj) return res.json(await Book.find({ isDeleted: false }).limit(3));
        const books = await Book.find({ tags: tagObj._id, isDeleted: false }).limit(3);
        res.json(books);
    }
};

module.exports = bookController;