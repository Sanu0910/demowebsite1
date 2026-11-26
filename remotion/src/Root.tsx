import React from "react";
import { Composition, Still } from "remotion";
import { Promo, PROMO_FRAMES } from "./Promo";
import { DeparturesPost, HeroBanner } from "./Banners";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Promo videos (20 s @ 30 fps) */}
    <Composition id="PromoReel" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="PromoLandscape" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1920} height={1080} />

    {/* Social banners */}
    <Still id="FacebookCover" component={HeroBanner} width={1640} height={624} />
    <Still id="WebsiteHero" component={HeroBanner} width={1920} height={1080} defaultProps={{ safe: { w: 1920, h: 760 } }} />
    <Still id="YouTubeBanner" component={HeroBanner} width={2560} height={1440} defaultProps={{ safe: { w: 1546, h: 423 } }} />
    <Still id="InstagramPost" component={DeparturesPost} width={1080} height={1350} />
  </>
);
