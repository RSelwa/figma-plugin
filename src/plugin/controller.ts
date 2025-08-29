import { TOKEN_KEY } from '@/constants';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-rectangles') {
    const nodes = [];

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);

    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-rectangles',
      message: `Created ${msg.count} Rectangles`,
    });
  }

  if (msg.type === 'set-token') {
    console.log('Setting token in client storage:', msg.token);

    await figma.clientStorage.setAsync(TOKEN_KEY, msg.token);
    return;
  }
  if (msg.type === 'get-token') {
    figma.clientStorage.getAsync(TOKEN_KEY);
    return;
  }

  figma.closePlugin();
};
