document.addEventListener('DOMContentLoaded', () => {
    const voteForms = document.querySelectorAll('form[action^="/posts/vote/"]');

    voteForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const actionUrl = form.action;
            const formData = new FormData(form);
            const voteValue = formData.get('setvoteto');

            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ setvoteto: voteValue })
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    // Update the vote count number 
                    const container = form.closest('div, footer'); 
                    const voteCountElement = container.querySelector('strong');
                    
                    if (voteCountElement) {
                        voteCountElement.textContent = `Votes: ${data.newCount}`;
                    }

                    
                    const allButtons = container.querySelectorAll('button');
                    allButtons.forEach(btn => btn.classList.add('outline'));

                    
                    const clickedButton = form.querySelector('button');
                    clickedButton.classList.remove('outline');
                }
            } catch (err) {
                console.error("Voting failed", err);
            }
        });
    });
});