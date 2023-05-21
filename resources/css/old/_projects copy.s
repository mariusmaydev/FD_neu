@import '../general/main.scss';
@import '../general/buttons.scss';
// @import '../general/NavigationBar.scss';

$color-project-hover         : rgba(64, 64, 64, 0.219);

@mixin A-ProjectList(){
    > .ProjectListMain {        
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        // box-sizing: co-box;
        overflow: hidden;
        &[id*='CART']{
            height: max-content;
            > .TableMain{
                > .ListMain {
                    overflow: hidden;
                    overflow-x: auto;
                }
            }
        }
        > .TableMain {
            position: relative;
            width: 98%;
            // height: 100%;
            overflow: hidden;
            margin-inline: 1%;
            box-sizing: border-box;
            >.ListMain {
                box-sizing: content-box;
                width: 100%;
                position: relative;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
                    justify-content: center;
                    align-content: start;

                overflow: auto;


                @include ProjectListElement();

            }
        }
        > [id*='head'] {
            position: relative;
            display: none !important;
            > div {
                position: relative;
                left: calc(0.6em + 1%);
                > span {

                }
            }
            > hr {
                margin: 0;
            }
        }
    }
}

@mixin ProjectListElement(){
    >.ListElement {
        position: relative;
        // @include T_container();
        background-color: transparent;
        aspect-ratio: $LIGHTER-ratio;
        // width: 100%;
        // max-width: 30%;
        // min-width: 8em;
        // flex: 1 1 20%;
        padding: 0.5em;
        margin: 0.5em;
        height: max-content;
        
        overflow: hidden;
        
        box-sizing: border-box;
        transition: box-shadow 0.1s ease-in;//, background-color 0.1s ease-in;
        > .container {
            position: relative;
            width: 100%;
            height: 100%;
            box-sizing: border-box !important;
            >.Lighter3D {
                // box-sizing: border-box;
                position: relative;
                width: 100%;
                height: 100%;
                overflow: visible;
                box-sizing: content-box !important;
                transform: translateY(-10%);
                > canvas {
                    box-sizing: content-box !important;
                }
            }
            > .buttonDiv {
                position: absolute;
                // background-color: red;
                bottom: 0;
                width: 100%;
                height: max-content;
                display: flex;
                justify-content: space-around;
                gap: 0.5rem;
                align-items: center;
                opacity: 0;
                transition: opacity 0.2s;
                > button {
                    width: 100%;
                    background-color: $color-primary;
                    padding: 0.3rem;
                    > span {
                        font-size: 2rem;
                    }
                    &:hover {
                        background-color: $color-primary-Dark;
                    }
                }
            }
        }
        &.First {
            // flex-grow: 1;
            aspect-ratio: $LIGHTER-ratio;
            position: relative;
            // height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 1;
            > button {
                width: 100%;
                height: 100%;
                > span {
                    font-size: 10vmin;
                } 
            }
        }
        &:hover {
            box-shadow:inset 0px 0px 0px 1px rgb(0, 0, 0);
            // background-color: white;

            > .container {
                > .buttonDiv {
                    opacity: 1;
                }
                > .Lighter3D {
                    transform: translateY(-10%);
                }
            }
        }
        >.ListElementHover {
            height: 0 !important;
            display: none !important;
            background-color: $color-project-hover;
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 4em;
            > button {
                > span {
                    font-size: 4em;
                }
            }
        }
        &[state*='active']{
            background-color: red;
            transform: scale(1.5);
        }
    }  
}