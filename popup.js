document.addEventListener('DOMContentLoaded', function () {
    const postContent = document.getElementById('post-content');
    const nextButton = document.getElementById('next-button');
  
    nextButton.addEventListener('click', () => {
        console.log('next button pressed')
        getRandomPost();
    });
  
    function getRandomPost() {
        const randomParam = Math.random(); // Generate a random number
        const apiUrl = `https://www.reddit.com/r/todayilearned/random.json?${randomParam}`;
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const post = data[0].data.children[0].data;
                postContent.innerHTML = `<a href="https://www.reddit.com${post.permalink}" target="_blank">${post.title}</a>`;
          
        })
        .catch(error => {
          console.error('Error fetching random post:', error);
        });
    }
  
    getRandomPost();
  });
  