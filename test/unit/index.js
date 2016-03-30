import fetchFavicon from '../../source/index';

describe('fetch-favicon', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(fetchFavicon, 'greet');
      fetchFavicon.greet();
    });

    it('should have been run once', () => {
      expect(fetchFavicon.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(fetchFavicon.greet).to.have.always.returned('hello');
    });
  });
});
