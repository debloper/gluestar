jQuery(document).ready(function($){

  //set animation timing
  var animationDelay = 2500,
    //letters effect
    lettersDelay = 50,
    //type effect
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800;

  initHeadline();

  function initHeadline() {
    //insert <i> element for each letter of a changing word
    singleLetters($('.animtype.letters').find('b'));
    //initialise headline animation
    animateHeadline($('.animtype'));
  }

  function singleLetters($words) {
    $words.each(function(){
      var word = $(this),
        letters = word.text().split(''),
        selected = word.hasClass('is-visible');
      for (var i in letters) {
        letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
      }
        var newLetters = letters.join('');
        word.html(newLetters).css('opacity', 1);
    });
  }

  function animateHeadline($headlines) {
    var duration = animationDelay;
    $headlines.each(function(){
      var headline = $(this);
      
      if (!headline.hasClass('type') ) {
        //assign to .animtype-words the width of its longest word
        var words = headline.find('.animtype-words b'),
          width = 0;
        words.each(function(){
          var wordWidth = $(this).width();
            if (wordWidth > width) width = wordWidth;
        });
        headline.find('.animtype-words').css('width', width);
      };

      //trigger animation
      setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
    });
  }

  function hideWord($word) {
    var nextWord = takeNext($word);
    
    if($word.parents('.animtype').hasClass('type')) {
      var parentSpan = $word.parent('.animtype-words');
      parentSpan.addClass('selected').removeClass('waiting');
      setTimeout(function(){
        parentSpan.removeClass('selected'); 
        $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
      }, selectionDuration);
      setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

    } else if($word.parents('.animtype').hasClass('letters')) {
      var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
      hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
      showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

    } else {
      switchWord($word, nextWord);
      setTimeout(function(){ hideWord(nextWord) }, animationDelay);
    }
  }

  function showWord($word, $duration) {
    showLetter($word.find('i').eq(0), $word, false, $duration);
    $word.addClass('is-visible').removeClass('is-hidden');
  }

  function hideLetter($letter, $word, $bool, $duration) {
    $letter.removeClass('in').addClass('out');

    if(!$letter.is(':last-child')) {
       setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
    } else if($bool) { 
       setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
    }

    if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
      var nextWord = takeNext($word);
      switchWord($word, nextWord);
    }
  }

  function showLetter($letter, $word, $bool, $duration) {
    $letter.addClass('in').removeClass('out');
    
    if(!$letter.is(':last-child')) { 
      setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
    } else { 
      if($word.parents('.animtype').hasClass('type')) {
        setTimeout(function () {
          $word.parents('.animtype-words').addClass('waiting');
        }, 200);
      }
      if(!$bool) {
        setTimeout(function () { hideWord($word) }, animationDelay)
      }
    }
  }

  function takeNext($word) {
    return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
  }

  function takePrev($word) {
    return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
  }

  function switchWord($oldWord, $newWord) {
    $oldWord.removeClass('is-visible').addClass('is-hidden');
    $newWord.removeClass('is-hidden').addClass('is-visible');
  }
});
