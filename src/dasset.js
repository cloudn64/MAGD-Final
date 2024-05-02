// I haven't decided if I care to use this yet

class DAsset {
    constructor() {
      this.asset; // Current fully loaded asset
      this.queuedAsset; // Currently loading asset. Will be passed to asset when completed, so in the meantime the previous asset can continue to be used.
      this.path; // Path to the asset
      this.isLoaded = 0; // An asset is loaded
    }
  
    loadDFont(path) {
      if (this.path != path || this.isLoaded != 1) { // only bother loading the font if it's not already loaded
        this.path = path;
        this.queuedAsset = loadFont(path, a => {this.isLoaded = 1; this.asset = this.queuedAsset}, a => {this.isLoaded = -1});
  
      }
      return this.isLoaded;
    }
  
    loadDImage(path) {
      if (this.path != path || this.isLoaded != 1) { // only bother loading the font if it's not already loaded
        this.path = path;
        this.queuedAsset = loadImage(path, a => {this.isLoaded = 1; this.asset = this.queuedAsset}, a => {this.isLoaded = -1; });
      }
      return this.isLoaded;
    }
  
    loadDString(path) {
      if (this.path != path || this.isLoaded != 1) { // only bother loading the font if it's not already loaded
        this.path = path;
        this.queuedAsset = loadStrings(path, a => {this.isLoaded = 1; this.asset = this.queuedAsset}, a => {this.isLoaded = -1; });
      }
      return this.isLoaded;
    }

    saveDString(stringArray) {
        if (this.path != null && this.isLoaded == 1) { // only bother loading the font if it's not already loaded
            saveStrings(stringArray, this.path);
        }
    }
}