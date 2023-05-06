const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog  = (blogs) => {
  const favorite = blogs.reduce((favorite, savedBlog) => favorite = favorite.likes > savedBlog.likes ? favorite : savedBlog, 0)

  return {
    'title': favorite.title,
    'author': favorite.author,
    'likes': favorite.likes
  }
}




module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}